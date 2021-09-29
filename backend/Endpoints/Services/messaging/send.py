# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Configuration.config import DB_SESSION, SES_CLIENT
from Models.Data.conversations.conversation import ConversationTable, ConversationTableSchema
from Models.Data.messages.message import MessageTable, MessageTableSchema
from Configuration.config import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from botocore.exceptions import ClientError
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT

class SendMessage(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()
    
    try:
      conversation_id = int(request.get_json()['id'])
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

    conversation = db_session.query(ConversationTable).filter_by(id=conversation_id).first()

    if (conversation == None):
      db_session.close()
      return NOT_FOUND
      
    elif (check_password_hash(user.password, password) and (user.id in conversation.user_ids)):
      corrected_data_msg = {
        'sender_id': user.id,
        'conversation_id': conversation.id,
        'body': request.get_json()['body']
      }

      posted_msg_data = MessageTableSchema(only=('sender_id','conversation_id','body',))\
        .load(corrected_data_msg)
      msg = MessageTable(**posted_msg_data, created_by="HTTP post request")

      db_session.add(msg)
      db_session.commit()

      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED
    
  def put(self):
    pass

  def delete(self):
    pass