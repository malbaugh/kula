# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Configuration.config import DB_SESSION
from Models.Users.users.user import UserTable
from Configuration.config import SERIALIZER
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash
from Statuses.statuses import NOT_FOUND, BAD_REQUEST, UNAUTHORIZED

class UpdatePassword(Resource):
  def get(self):
    pass

  def post(self):
    pass

  def put(self):
    db_session = DB_SESSION()

    data = request.get_json()

    old_password = data['old_password']
    new_password = data['new_password']

    user = db_session.query(UserTable).filter_by(id=int(data['id'])).first()

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif (not check_password_hash(user.password, old_password)):
      db_session.close()
      return UNAUTHORIZED

    elif (check_password_hash(user.password, old_password)):
      user.password = generate_password_hash(new_password)
      user.updated_at = datetime.now()
      user.last_updated_by = "HTTP put request"

      db_session.commit()

      token = {'token': SERIALIZER.dumps({'email': user.email, 'password': new_password}).decode("utf-8")}

      db_session.close()

      response = jsonify(token)
      response.status_code = 200
      return response

    else:
      db_session.close()
      return BAD_REQUEST

  def delete(self):
    pass