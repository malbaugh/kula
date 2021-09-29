# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Configuration.config import DB_SESSION
from Models.Users.users.user import UserTable
from Statuses.statuses import NO_CONTENT, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED
from Configuration.config import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from datetime import datetime

class UpdateUser(Resource):
  def get(self):
    pass

  def post(self):
    pass

  def put(self):
    db_session = DB_SESSION()
    try:
      data = request.get_json()

      if (data.get('lastName') == None):
        posted_last_name = ""

      else:
        posted_last_name = data['lastName']

      token = request.headers.get("Authorization")
    except:
      db_session.close()
      return UNAUTHORIZED

    if (token != None):
      try:
        current_password = SERIALIZER.loads(token)['password']
      except:
        db_session.close()
        return UNAUTHORIZED

    else: 
      db_session.close()
      return UNAUTHORIZED

    user = db_session.query(UserTable).filter_by(id=int(data['id'])).first()

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif (check_password_hash(user.password, current_password)):
      user.email = data['email']
      user.first_name = data['firstName']
      user.last_name = posted_last_name
      user.updated_at = datetime.now()
      user.last_updated_by = "HTTP put request"

      user.address = data['address']
      user.city = data['city']
      user.state = data['state']
      user.zipcode = data['zipcode']

      if (data['organization']):
        if (data.get('lastName') == None):
          user.search = data['firstName']+' '+data['state']+' '+data['city']+' '+data['address']+' '+str(int(data['zipcode']))
        else:
          user.search = data['firstName']+' '+data['lastName']+' '+data['city']+' '+data['state']+' '+data['address']+' '+str(int(data['zipcode']))
      
      else:
        if (data.get('lastName') == None):
          user.search = data['firstName']+' '+data['state']+' '+data['city']
        else:
          user.search = data['firstName']+' '+data['lastName']+' '+data['city']+' '+data['state']

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else: 
      db_session.close()
      return UNAUTHORIZED

  def delete(self):
    pass