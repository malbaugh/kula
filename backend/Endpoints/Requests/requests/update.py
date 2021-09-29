# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Configuration.config import DB_SESSION
from Models.Requests.requests.request import RequestTable
from Configuration.config import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from datetime import datetime
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT

class UpdateRequest(Resource):
  def get(self):
    pass

  def post(self):
    pass
    
  def put(self):
    db_session = DB_SESSION()
    
    try:
      requested_item_id = int(request.get_json()['id'])
      requested_item = db_session.query(RequestTable).filter_by(id=requested_item_id).first()
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

    if (requested_item == None):
      db_session.close()
      return NOT_FOUND

    elif (requested_item.requester_id == user.id and check_password_hash(user.password, password)):
      data = request.get_json()

      requested_item.name = data['name']
      requested_item.description = data['description']
      requested_item.city = data['city']
      requested_item.state = data['state']
      requested_item.zipcode = data['zipcode']
      requested_item.covered_status = data['coveredStatus']
      requested_item.filled_status = data['filledStatus']
      requested_item.covered_at = data['coveredAt']

      requested_item.updated_at = datetime.now()
      requested_item.last_updated_by = "HTTP put request"

      requested_item.search = data['name']+' '+data['description']+' '+data['city']+' '+data['state']

      db_session.commit()
      db_session.close()

      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self):
    pass