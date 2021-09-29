# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Configuration.config import DB_SESSION, S3_RESOURCE
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Models.Users.participant_users.participant_user import ParticipantUserTable
from Configuration.config import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from Statuses.statuses import NOT_FOUND, UNAUTHORIZED
from datetime import datetime
import base64, random, string

class UpdatePhoto(Resource):
  def get(self):
    pass

  def post(self):
    pass

  def put(self):
    pass
    # try:
    #   photo = request.get_json()['photo']

    #   rand_string = ''.join([random.choice(string.ascii_letters + string.digits) for n in range(32)])
    #   token = request.headers.get("Authorization")
    # except:
    #   return UNAUTHORIZED

    # if (token != None):
    #   try:
    #     email = SERIALIZER.loads(token)['email']
    #     password = SERIALIZER.loads(token)['password']
    #     user_type = SERIALIZER.loads(token)['user_type']
    #   except:
    #     db_session.close()
    #     return UNAUTHORIZED
        
    # else: 
    #   return UNAUTHORIZED

    # db_session = DB_SESSION()

    # user = db_session.query(UserTable).filter_by(email=email).first()

    # if (check_password_hash(user.password, password):
    #   filename = "media/" + str(user.id) + "/" + "profile_picture" + rand_string + ".png"

    #   bucket = S3_RESOURCE.Bucket(name='crowd-u-participant-users')

    #   try:
    #     S3_RESOURCE.Object(bucket_name=bucket.name, key=filename).delete()
    #   except:
    #     pass

    #   bucket_object = S3_RESOURCE.Object(bucket_name=bucket.name, key=filename)
    #   bucket_object.put(Body=base64.b64decode(photo),ACL='public-read')

    #   file_url = "https://{0}.s3.amazonaws.com/{1}".format(bucket.name,filename)

    #   participant_user_object = db_session.query(ParticipantUserTable).filter_by(username=username).first()
    #   participant_user_object.participant_profile_data[0].photo = file_url
    #   participant_user_object.updated_at = datetime.now()
    #   participant_user_object.last_updated_by = "HTTP put request"

    #   db_session.commit()
    #   db_session.close()

    #   response = jsonify({'photo': file_url})
    #   response.status_code = 200
    #   return response

    # elif ((current_username == username) and check_password_hash(user.password, password) and (user_type == "challenger")): 
    #   filename = "media/" + username + "/" + "profile_picture" + rand_string+ ".png"

    #   bucket = S3_RESOURCE.Bucket(name='crowd-u-challenge-users')

    #   try:
    #     S3_RESOURCE.Object(bucket_name=bucket.name, key=filename).delete()
    #   except:
    #     pass

    #   bucket_object = S3_RESOURCE.Object(bucket_name=bucket.name, key=filename)
    #   bucket_object.put(Body=base64.b64decode(photo),ACL='public-read')

    #   file_url = "https://{0}.s3.amazonaws.com/{1}".format(bucket.name,filename)

    #   challenge_user_object = db_session.query(ChallengeUserTable).filter_by(username=username).first()

    #   for department in db_session.query(ChallengeUserTable).filter_by(lead_id=challenge_user_object.parent_id).all():
    #     department.challenge_owner_profile_data[0].photo = file_url

    #     department.last_updated_by = "HTTP put request"
    #     department.updated_at = datetime.now()

    #   challenge_user_object.challenge_owner_profile_data[0].photo = file_url
    #   challenge_user_object.updated_at = datetime.now()
    #   challenge_user_object.last_updated_by = "HTTP put request"

    #   db_session.commit()
    #   db_session.close()

    #   response = jsonify({'photo': file_url})
    #   response.status_code = 200
    #   return response

    # else:
    #   db_session.close()
    #   return NOT_FOUND

  def delete(self):
    pass