# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Configuration.config import DB_SESSION, SES_CLIENT
from Models.Data.messages.message import MessageTable
from Configuration.config import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from botocore.exceptions import ClientError
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT

class MarkMessageRead(Resource):
  def get(self):
    pass

  def post(self):
    pass
    
  def put(self):
    db_session = DB_SESSION()
    
    try:
      message_id = int(request.get_json()['id'])
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

    message = db_session.query(MessageTable).filter_by(id=message_id).first()

    if (message == None):
      db_session.close()
      return NOT_FOUND
      
    elif (check_password_hash(user.password, password)):
      message.read = True

      db_session.commit()
      db_session.close()

      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self):
    pass