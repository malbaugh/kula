# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Configuration.config import DB_SESSION, SES_CLIENT, SERIALIZER
from Models.Items.items.item import ItemTable
from Models.Users.users.user import UserTable
from Models.Data.conversations.conversation import ConversationTable, ConversationTableSchema
from Models.Data.messages.message import MessageTable, MessageTableSchema
from werkzeug.security import check_password_hash
from datetime import datetime
from botocore.exceptions import ClientError
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT

class CreateClaim(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()
    
    try:
      item_id = int(request.get_json()['item_id'])
      item = db_session.query(ItemTable).filter_by(id=item_id).first()
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

    if (item == None or item.claimed_status or item.taken_status):
      db_session.close()
      return NOT_FOUND

    elif (check_password_hash(user.password, password)):
      owner_user = db_session.query(UserTable).filter_by(id=int(item.owner_id)).first()

      corrected_data = {
        'title': item.name + ': #' + str(item.claims),
        'blurb': request.get_json()['description'],
        'user_ids': [user.id, owner_user.id],
        'photo': item.photo,
        'purpose': "Item"
      }

      item.claims = item.claims + 1

      posted_data = ConversationTableSchema(only=('title','user_ids','blurb','purpose','photo',))\
        .load(corrected_data)
      conversation = ConversationTable(**posted_data, created_by="HTTP post request")
      conversation.item_id = item.id
      conversation.auth_user_id = owner_user.id
      conversation.search = item.name + ': #' + str(item.claims) + request.get_json()['description']

      db_session.add(conversation)
      db_session.commit()
      
      corrected_data_msg = {
        'sender_id': user.id,
        'conversation_id': conversation.id,
        'body': request.get_json()['description']
      }

      posted_msg_data = MessageTableSchema(only=('sender_id','conversation_id','body',))\
        .load(corrected_data_msg)
      msg = MessageTable(**posted_msg_data, created_by="HTTP post request")
      msg.item_id = item.id

      db_session.add(msg)
      db_session.commit()

      general_address = "Someone has submitted a claim for the item, " + item.name + ". Log into <a href='https://kula.com/' >https://kula.com/</a> to see why they need the item and determine whether you would be willing donate the item to them."
      body_html = """<html><p>Hello """ + owner_user.first_name + """,</p><p>""" + general_address + """</p><p>If you have any questions or concerns, feel free to contact us at support@kula.com.</p><p>Best,</p><p>Kula Team</p></html>"""

      try:
        SES_CLIENT.send_email(
          Destination={
            'ToAddresses': [
              owner_user.email,
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
              'Data': "Someone wants the item you donated!",
            },
          },
          Source="support@kula.com",
        )

      except ClientError:
        return NOT_FOUND

      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED
    
  def put(self):
    pass

  def delete(self):
    pass