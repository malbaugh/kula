# coding=utf-8

from os import path
from Configuration.config import SERIALIZER
from flask_restful import Resource
from Configuration.config import DB_SESSION
from werkzeug.security import check_password_hash
from Models.Users.users.user import UserTable
from Statuses.statuses import NO_CONTENT, NOT_FOUND
from flask import render_template, Response


class VerifyEmail(Resource):
  def get(self,token):
    db_session = DB_SESSION()
    try:
      email = SERIALIZER.loads(token)['email']
      password = SERIALIZER.loads(token)['password']
    except:
      db_session.close()
      resp = Response(response=render_template('error-template.html'),status=200,mimetype="text/html")
      return resp

    user = db_session.query(UserTable).filter_by(email=email).first()
    if (user and check_password_hash(user.password, password)):
      user.email_confirmed = True
      db_session.commit()
      db_session.close()
      resp = Response(response=render_template('verify-template.html'),status=200,mimetype="text/html")
      return resp

    else:
      db_session.close()
      resp = Response(response=render_template('error-template.html'),status=200,mimetype="text/html")
      return resp

  def post(self,token):
    pass

  def put(self,token):
    pass

  def delete(self,token):
    pass