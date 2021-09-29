# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Configuration.config import DB_SESSION, S3_RESOURCE, SES_CLIENT
from Models.Users.users.user import UserTable, UserTableSchema
from Statuses.statuses import NO_CONTENT, NOT_FOUND, CONFLICT
from Configuration.config import SERIALIZER
from werkzeug.security import generate_password_hash
from botocore.exceptions import ClientError
import base64

class Register(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()

    if (db_session.query(UserTable).filter_by(email=request.get_json()['user']['email']).first() == None):
        
      corrected_data = { 
        'email': request.get_json()['user']['email'], 
        'password': generate_password_hash(request.get_json()['password']),
        'first_name': request.get_json()['user']['firstName'], 
        'last_name': request.get_json()['user']['lastName'],
        'organization': request.get_json()['user']['organization'],
        'address': request.get_json()['user']['address'],
        'city': request.get_json()['user']['city'],
        'state': request.get_json()['user']['state'],
        'zipcode': request.get_json()['user']['zipcode'],
      }

      posted_user = UserTableSchema(only=('email','password','organization','address','city','state','zipcode','first_name','last_name',))\
        .load(corrected_data)

      user = UserTable(**posted_user, created_by="HTTP post request")
      user.email_confirmed = True # TODO: need to update this eventually

      msg_body_admin = request.get_json()['user']['email'] + " " + request.get_json()['user']['firstName'] + " " + request.get_json()['user']['city'] + " " + request.get_json()['user']['state'] + " " + str(request.get_json()['user']['zipcode'])

      token = SERIALIZER.dumps({'email': request.get_json()['user']['email'], 'password': request.get_json()['password']}).decode("utf-8")
      
      if (request.get_json()['user']['organization']):
        if (request.get_json()['user'].get('lastName') == None):
          user.search = request.get_json()['user']['firstName']+' '+request.get_json()['user']['state']+' '+request.get_json()['user']['city']+' '+request.get_json()['user']['address']+' '+str(int(request.get_json()['user']['zipcode']))
        else:
          user.search = request.get_json()['user']['firstName']+' '+request.get_json()['user']['lastName']+' '+request.get_json()['user']['city']+' '+request.get_json()['user']['state']+' '+request.get_json()['user']['address']+' '+str(int(request.get_json()['user']['zipcode']))
      
      else:
        if (request.get_json()['user'].get('lastName') == None):
          user.search = request.get_json()['user']['firstName']+' '+request.get_json()['user']['state']+' '+request.get_json()['user']['city']
        else:
          user.search = request.get_json()['user']['firstName']+' '+request.get_json()['user']['lastName']+' '+request.get_json()['user']['city']+' '+request.get_json()['user']['state']

      body_html = """<html>
        <head>
          <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        </head>
        <style type="text/css">
        body{background-color: #88BDBF;margin: 0px;}
        </style>
        <body>
          <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #FF7A5A;">
            <tr>
              <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                  <tr>
                    <td style="background-color:#FF7A5A;height:100px;font-size:50px;color:#fff;"><i class="fa fa-envelope-o" aria-hidden="true"></i></td>
                  </tr>
                  <tr>
                    <td>
                      <h1 style="padding-top:25px;">Email Confirmation</h1>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="padding:0px 100px;">
                        Verify your email to finish your registration for Kula.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href='https://api.kula.com/verify-email/"""+token+"""'  style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#FF7A5A; ">Verify Email</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                  <tr>
                    <td>
                      <div style="margin-top: 20px;">
                        <span style="font-size:12px;">Kula</span><br>
                        <span style="font-size:12px;">Copyright © 2021 Kula</span>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>"""

      try:
        SES_CLIENT.send_email(
          Destination={
            'ToAddresses': [
                request.get_json()['user']['email'],
            ],
          },
          Message={
            'Body': {
              'Html': {
                'Charset': "UTF-8",
                'Data': body_html,
              },
            },
            'Subject': {
              'Charset': "UTF-8",
              'Data': "Confirm Your Email | Kula",
            },
          },
          Source="support@kula.com",
        )

        SES_CLIENT.send_email(
          Destination={
            'ToAddresses': [
                'support@kula.com',
            ],
          },
          Message={
            'Body': {
              'Html': {
                'Charset': "UTF-8",
                'Data': msg_body_admin,
              },
            },
            'Subject': {
              'Charset': "UTF-8",
              'Data': "New User",
            },
          },
          Source="support@kula.com",
        )
      
      except ClientError:
        return NOT_FOUND
    
      db_session.add(user)
      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else: 
      db_session.close()
      return CONFLICT

  def put(self):
    pass

  def delete(self):
    pass