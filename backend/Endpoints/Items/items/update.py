# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Configuration.config import DB_SESSION
from Models.Items.items.item import ItemTable
from Configuration.config import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from datetime import datetime
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT

class UpdateItem(Resource):
  def get(self):
    pass

  def post(self):
    pass
    
  def put(self):
    db_session = DB_SESSION()
    
    try:
      item_id = int(request.get_json()['id'])
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

    if (item == None):
      db_session.close()
      return NOT_FOUND

    elif (item.owner_id == user.id and check_password_hash(user.password, password)):
      data = request.get_json()

      item.name = data['name']
      item.description = data['description']
      item.instructions = data['instructions']
      item.city = data['city']
      item.state = data['state']
      item.zipcode = data['zipcode']
      item.claimed_status = data['claimedStatus']
      item.taken_status = data['takenStatus']
      item.claimed_at = data['claimedAt']

      item.updated_at = datetime.now()
      item.last_updated_by = "HTTP put request"

      item.search = data['name']+' '+data['description']+' '+data['city']+' '+data['state']

      db_session.commit()
      db_session.close()

      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self):
    pass