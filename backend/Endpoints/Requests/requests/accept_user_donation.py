# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Configuration.config import DB_SESSION, SES_CLIENT, SERIALIZER
from Models.Requests.requests.request import RequestTable
from Models.Users.users.user import UserTable
from Models.Data.conversations.conversation import ConversationTable
from werkzeug.security import check_password_hash
from datetime import datetime
from botocore.exceptions import ClientError
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT

class AcceptUserDonation(Resource):
  def get(self):
    pass

  def post(self):
    pass
    
  def put(self):
    db_session = DB_SESSION()
    
    try:
      item_request_id = int(request.get_json()['item_request_id'])
      conversation_id = int(request.get_json()['conversation_id'])
      conversation = db_session.query(ConversationTable).filter_by(id=conversation_id).first()
      item_request = db_session.query(RequestTable).filter_by(id=item_request_id).first()
      token = request.headers.get("Authorization")
    except:
      db_session.close()
      return UNAUTHORIZED

    if (token != None):
      try:
        email = SERIALIZER.loads(token)['email']
        password = SERIALIZER.loads(token)['password']
        user = db_session.query(UserTable).filter_by(email=email).first()

        for uid in conversation.user_ids:
          if (uid != user.id):
            selected_user_id = uid

      except:
        db_session.close()
        return UNAUTHORIZED
        
    else: 
      db_session.close()
      return UNAUTHORIZED

    if (item_request == None or conversation == None):
      db_session.close()
      return NOT_FOUND

    owner_user = db_session.query(UserTable).filter_by(id=int(item_request.requester_id)).first()

    if (owner_user.id == user.id and check_password_hash(user.password, password)):
      item_request.covered_status = True

      selected_user = db_session.query(UserTable).filter_by(id=selected_user_id).first()

      rejected_conversations = db_session.query(ConversationTable).filter_by(item_request_id=item_request.id).all()
      for convo in rejected_conversations:
        if (convo.id != conversation_id):
          convo.disabled = True
        else:
          convo.complete = True

      item_request.donor_id = selected_user_id
      item_request.covered_at = datetime.now()
      item_request.updated_at = datetime.now()
      item_request.last_updated_by = "HTTP put request"

      if (owner_user.organization):
        general_address = "Thanks for using Kula, and thank you for offering to donate the requested item, " + item_request.name + ". Log into <a href='https://kula.com/' >https://kula.com/</a> to coordinate with the individual who requested it."
        owners_address = "We will let you decide how you would like to exchange the item. You can ask the recipient of your donation to pick it up at your address, meet them at some public location, or drop it off directly to the individual who requested the item. Please confirm this plan with the individual who made the request and ensure you are both on the same page."
        body_html = """<html><p>Hello """ + selected_user.first_name + """,</p><p>""" + general_address + """</p><p>""" + owners_address + """</p><p>If you have any questions or concerns, feel free to contact us at support@kula.com.</p><p>Best,</p><p>Kula Team</p></html>"""

        try:
          SES_CLIENT.send_email(
            Destination={
              'ToAddresses': [
                selected_user.email,
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
                'Data': "Your donation was accepted!",
              },
            },
            Source="support@kula.com",
          )

        except ClientError:
          return NOT_FOUND

      else:
        general_address = "Thanks for using Kula, and thank you for offering to donate the requested item, " + item_request.name + ". Log into <a href='https://kula.com/' >https://kula.com/</a> to coordinate with the individual who requested it."
        owners_address = "We will let you decide how you would like to exchange the item. You can ask the recipient of your donation to pick it up at your address, meet them at some public location, or drop it off directly to the individual who requested the item. Please confirm this plan with the individual who made the request and ensure you are both on the same page."
        body_html = """<html><p>Hello """ + selected_user.first_name + """,</p><p>""" + general_address + """</p><p>""" + owners_address + """</p><p>If you have any questions or concerns, feel free to contact us at support@kula.com.</p><p>Best,</p><p>Kula Team</p></html>"""

        try:
          SES_CLIENT.send_email(
            Destination={
              'ToAddresses': [
                selected_user.email,
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
                'Data': "Your donation was accepted!",
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