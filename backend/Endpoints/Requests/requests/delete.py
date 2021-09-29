# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Configuration.config import DB_SESSION, S3_RESOURCE, SERIALIZER
from Models.Users.users.user import UserTable
from Models.Requests.requests.request import RequestTable
from Models.Data.conversations.conversation import ConversationTable
from Models.Data.messages.message import MessageTable
from werkzeug.security import check_password_hash
from Statuses.statuses import NO_CONTENT, UNAUTHORIZED, NOT_FOUND

class Delete(Resource):
  def get(self,item_request_id):
    pass

  def post(self,item_request_id):
    pass

  def put(self,item_request_id):
    pass

  def delete(self,item_request_id):
    try:
      token = request.headers.get("Authorization")
    except:
      return UNAUTHORIZED

    if (token != None):
      try:
        email = SERIALIZER.loads(token)['email']
        password = SERIALIZER.loads(token)['password']
      except:
        return UNAUTHORIZED
        
    else: 
      return UNAUTHORIZED
    
    db_session = DB_SESSION()
    item_request = db_session.query(RequestTable).filter_by(id=int(item_request_id)).first()
    user = db_session.query(UserTable).filter_by(email=email).first()

    if (item_request == None):
      db_session.close()
      return NOT_FOUND

    elif (item_request.requester_id == user.id and check_password_hash(user.password, password)):
      db_session.query(RequestTable).filter_by(id=int(item_request_id)).delete()

      conversations = db_session.query(ConversationTable).filter_by(item_request_id=item_request.id).all()
      for conversation in conversations:
        db_session.query(MessageTable).filter_by(conversation_id=conversation.id).delete()
        filename = "media/" + str(conversation.id) + "/" + "donation_image.png"
        bucket = S3_RESOURCE.Bucket(name='kula-donation-offers')
        bucket_object = S3_RESOURCE.Object(bucket_name=bucket.name, key=filename).delete()

      db_session.query(ConversationTable).filter_by(item_request_id=item_request.id).delete()

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED