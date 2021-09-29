# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Configuration.config import DB_SESSION
from Configuration.config import SES_CLIENT
from Models.Data.events.event import EventTable, EventTableSchema
from botocore.exceptions import ClientError
from Statuses.statuses import NO_CONTENT, NOT_FOUND
from Configuration.config import SERIALIZER
from Models.Users.users.user import UserTable

class NewEvent(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()

    try:
      data = request.get_json()
      event = EventTable(data['action'],data['description'],data['story'],"","HTTP POST")
    except:
      pass

    try:
      token = request.headers.get("Authorization")
      
      email = SERIALIZER.loads(token)['email']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(UserTable).filter_by(email=email).first()
      event.user_id = user.id
      db_session.add(event)
      db_session.commit()
      db_session.close()
      return NO_CONTENT

    except:
      db_session.add(event)
      db_session.commit()
      db_session.close()
      return NO_CONTENT

  def put(self):
    pass

  def delete(self):
    pass