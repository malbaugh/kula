# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Configuration.config import DB_SESSION, SES_CLIENT
from Models.Requests.requests.request import RequestTable
from Models.Data.conversations.conversation import ConversationTable
from Configuration.config import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from botocore.exceptions import ClientError
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT
from datetime import datetime

class RepostRequest(Resource):
  def get(self):
    pass

  def post(self):
    pass
    
  def put(self):
    db_session = DB_SESSION()
    
    try:
      requested_item_id = int(request.get_json()['id'])
      token = request.headers.get("Authorization")
    except:
      db_session.close()
      return UNAUTHORIZED

    if (token != None):
      try:
        email = SERIALIZER.loads(token)['email']
        password = SERIALIZER.loads(token)['password']
        user = db_session.query(UserTable).filter_by(email=email).first()
      except:
        db_session.close()
        return UNAUTHORIZED

    else: 
      db_session.close()
      return UNAUTHORIZED

    if (user == None):
      db_session.close()
      return NOT_FOUND

    requested_item = db_session.query(RequestTable).filter_by(id=requested_item_id).first()

    if (requested_item == None):
      db_session.close()
      return NOT_FOUND
      
    elif ((user.id == requested_item.requester_id) and check_password_hash(user.password, password)):
      requested_item.filled_status = False
      requested_item.covered_status = False

      requested_item.updated_at = datetime.now()
      requested_item.last_updated_by = "HTTP put request"

      revoked_user = db_session.query(UserTable).filter_by(id=int(requested_item.donor_id)).first()

      rejected_conversations = db_session.query(ConversationTable).filter_by(item_request_id=requested_item.id).all()

      waiting_user_ids = []
      for convo in rejected_conversations:
        if (convo.disabled == False):
          convo.complete = False
          convo.disabled = True
        else:
          convo.complete = False
          convo.disabled = False
          ids = convo.user_ids
          for uid in ids:
            if (uid != user.id):
              waiting_user_ids.append(uid)

      general_address = "Unfortunately, the item you offered to donate for the request, " + requested_item.name + ", is no longer needed by the person who requested it. Consider logging back into <a href='https://kula.com/' >https://kula.com/</a> and donating the item anyway. Someone in your community could probably use it."
      body_html = """<html><p>Hello """ + revoked_user.first_name + """,</p><p>""" + general_address + """</p><p>If you have any questions or concerns, feel free to contact us at support@kula.com.</p><p>Best,</p><p>Kula Team</p></html>"""

      try:
        SES_CLIENT.send_email(
          Destination={
            'ToAddresses': [
              revoked_user.email,
            ],
          },
          Message={
            'Body': {
              'Html': {
                'Charset': "UTF-8",
                'Data': body_html,
              },
            },
            'Subject': {
              'Charset': "UTF-8",
              'Data': "Kula Item Claim Revoked",
            },
          },
          Source="support@kula.com",
        )

      except ClientError:
        return NOT_FOUND

      for userid in waiting_user_ids:
        user = db_session.query(UserTable).filter_by(id=userid).first()

        general_address = "One of the items you offered to donate for a request, " + requested_item.name + ", could potentially be needed again. Log into <a href='https://kula.com/' >https://kula.com/</a> and see if the requester has reached out to you!"
        body_html = """<html><p>Hello """ + user.first_name + """,</p><p>""" + general_address + """</p><p>If you have any questions or concerns, feel free to contact us at support@kula.com.</p><p>Best,</p><p>Kula Team</p></html>"""

        try:
          SES_CLIENT.send_email(
            Destination={
              'ToAddresses': [
                user.email,
              ],
            },
            Message={
              'Body': {
                'Html': {
                  'Charset': "UTF-8",
                  'Data': body_html,
                },
              },
              'Subject': {
                'Charset': "UTF-8",
                'Data': "Kula Item Available Again",
              },
            },
            Source="support@kula.com",
          )

        except ClientError:
          return NOT_FOUND

      db_session.commit()
      db_session.close()

      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self):
    pass