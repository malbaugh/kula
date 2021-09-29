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

class MarkRequestFilled(Resource):
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
      requested_item.covered_status = True
      requested_item.filled_status = True

      conversations = db_session.query(ConversationTable).filter_by(item_request_id=requested_item.id).all()
      for convo in conversations:
        if (convo.disabled == True):
          db_session.query(ConversationTable).filter_by(id=convo.id).delete()

      donor = db_session.query(UserTable).filter_by(id=int(requested_item.donor_id)).first()
      donor.rating += 1
      user.rating += 1

      db_session.commit()
      db_session.close()

      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self):
    pass