# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Configuration.config import DB_SESSION, SES_CLIENT
from Models.Items.items.item import ItemTable
from Models.Data.conversations.conversation import ConversationTable
from Configuration.config import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from botocore.exceptions import ClientError
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT
from datetime import datetime

class RepostItem(Resource):
  def get(self):
    pass

  def post(self):
    pass
    
  def put(self):
    db_session = DB_SESSION()
    
    try:
      item_id = int(request.get_json()['id'])
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

    item = db_session.query(ItemTable).filter_by(id=item_id).first()

    if (item == None):
      db_session.close()
      return NOT_FOUND
      
    elif ((user.id == item.owner_id) and check_password_hash(user.password, password)):
      item.taken_status = False
      item.claimed_status = False

      item.updated_at = datetime.now()
      item.last_updated_by = "HTTP put request"

      revoked_user = db_session.query(UserTable).filter_by(id=int(item.selected_user_id)).first()

      rejected_conversations = db_session.query(ConversationTable).filter_by(item_id=item.id).all()

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

      general_address = "Unfortunately, you no longer have a claim on the item, " + item.name + ". To avoid future revocations of claims, please be prompt to pick up the items you claim and respect the restrictions or wishes communicated by the owner of the item."
      owners_address = "If we somehow contributed to your inability to get the item or if you would like to give us critical feedback on how we could make the process of getting items easier, please feel free to contact us!"
      body_html = """<html><p>Hello """ + revoked_user.first_name + """,</p><p>""" + general_address + """</p><p>""" + owners_address + """</p><p>If you have any questions or concerns, feel free to contact us at support@kula.com.</p><p>Best,</p><p>Kula Team</p></html>"""

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

        general_address = "One of the items you claimed but were not selected to get, " + item.name + ", has been made available again. Log into <a href='https://kula.com/' >https://kula.com/</a> to send the owner a message on why you should get the item!"
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