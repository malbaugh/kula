# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Configuration.config import DB_SESSION, SERIALIZER
from Models.Items.items.item import ItemTable, ItemTableSchema
from Models.Items.queries.query import ItemQueryTable, ItemQueryTableSchema
from Models.Data.conversations.conversation import ConversationTable, ConversationTableSchema
from Models.Data.messages.message import MessageTable, MessageTableSchema
from datetime import datetime
from Models.Users.users.user import UserTable
from sqlalchemy.sql.expression import func
from Statuses.statuses import BAD_REQUEST
from werkzeug.security import check_password_hash
from sqlalchemy import desc
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, FORBIDDEN, NO_CONTENT

class UnreadMessages(Resource):
  def get(self):
    db_session = DB_SESSION()
    try:
      token = request.headers.get("Authorization")
      email = SERIALIZER.loads(token)['email']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(UserTable).filter_by(email=email).first()
    except:
      db_session.close()
      return NO_CONTENT

    if (check_password_hash(user.password, password)):
      conversation_objects = db_session.query(ConversationTable)
      conversation_objects = conversation_objects.filter(func.array_to_string(ConversationTable.user_ids,',','*').ilike('%' + str(user.id) + '%'))
      
      conversation_objects = conversation_objects.order_by(desc(ConversationTable.updated_at))
      
      unread_messages = 0
      messages = []
      message_schema = MessageTableSchema(many=True)
      for conversation in conversation_objects:
        message_objects = db_session.query(MessageTable)
        message_objects = message_objects.filter(MessageTable.conversation_id == conversation.id)
        message = message_objects[-1]
        if (message.sender_id != user.id and not message.read):
          unread_messages = unread_messages + 1

      db_session.close()
      
      response = jsonify(unread_messages)
      response.status_code = 200
      return response

    else: 
      db_session.close()
      return UNAUTHORIZED

  def post(self):
    pass
    
  def put(self):
    pass

  def delete(self):
    pass