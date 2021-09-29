# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Configuration.config import DB_SESSION, S3_RESOURCE, SERIALIZER
from Models.Requests.requests.request import RequestTable, RequestTableSchema
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, FORBIDDEN, NO_CONTENT
from botocore.exceptions import ClientError
import base64
  
class RegisterRequest(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()
    try:
      data = request.get_json()['requested_item']
      # img = request.get_json()['photo']
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

    elif (user.email_confirmed == False):
      db_session.close()
      return FORBIDDEN

    elif (check_password_hash(user.password, password)):

      corrected_data = {
        'name': data['name'], 
        'description': data['description'],
        'requester_id': data['requesterId'],
        'city': data['city'],
        'state': data['state'],
        'zipcode': data['zipcode']
      }

      posted_requested_item = RequestTableSchema(only=('name', 'requester_id', 'description', 'city', 'state', 'zipcode'))\
        .load(corrected_data)
      requested_item = RequestTable(**posted_requested_item, created_by="HTTP post request")

      requested_item.search = data['name']+' '+data['description']+' '+data['city']+' '+data['state']
      # requested_item.instructions = request.get_json()['instructions']

      db_session.add(requested_item)
      db_session.commit()

      # requested_item_id = requested_item.id

      # filename = "media/" + str(requested_item_id) + "/" + "item_picture.png"

      # bucket = S3_RESOURCE.Bucket(name='kula-items')
      # bucket_object = S3_RESOURCE.Object(bucket_name=bucket.name, key=filename)
      # bucket_object.put(Body=base64.b64decode(img),ACL='public-read')

      # file_url = "https://{0}.s3.amazonaws.com/{1}".format(bucket.name,filename)

      # requested_item.photo = file_url

      # db_session.commit()
      db_session.close()

      return NO_CONTENT

    else: 
      db_session.close()
      return UNAUTHORIZED

    
  def put(self):
    pass

  def delete(self):
    pass