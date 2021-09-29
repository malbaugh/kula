# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Configuration.config import DB_SESSION
from Models.Users.users.user import UserTable, UserTableSchema
from Configuration.config import SERIALIZER
from werkzeug.security import check_password_hash
from Statuses.statuses import NOT_FOUND, BAD_REQUEST, UNAUTHORIZED

class Login(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()

    email = request.get_json()['email']
    password = request.get_json()['password']

    user = db_session.query(UserTable).filter_by(email=email).first()

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif (user.email == email and check_password_hash(user.password, password)):
      if (db_session.query(UserTable).filter_by(email=email).first()):
        token = {'token': SERIALIZER.dumps({'email': user.email, 'password': password}).decode("utf-8")}

        user_schema = UserTableSchema(exclude=('password',))
        user_object = db_session.query(UserTable).filter_by(email=email).first()
        user = user_schema.dump(user_object)

        db_session.close()

        response = jsonify(token, user)
        response.status_code = 200
        return response

      else:
        db_session.close()
        return BAD_REQUEST

    else:
      db_session.close()
      return UNAUTHORIZED

  def put(self):
    pass

  def delete(self):
    pass