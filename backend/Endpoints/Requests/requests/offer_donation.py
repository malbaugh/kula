# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Configuration.config import DB_SESSION, SES_CLIENT, S3_RESOURCE, SERIALIZER
from Models.Requests.requests.request import RequestTable
from Models.Users.users.user import UserTable
from Models.Data.conversations.conversation import ConversationTable, ConversationTableSchema
from Models.Data.messages.message import MessageTable, MessageTableSchema
from werkzeug.security import check_password_hash
from datetime import datetime
from botocore.exceptions import ClientError
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT
import base64

class OfferDonation(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()
    
    try:
      item_request_id = int(request.get_json()['item_request_id'])
      img = request.get_json()['photo']
      item_request = db_session.query(RequestTable).filter_by(id=item_request_id).first()
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

    if (item_request == None or item_request.covered_status or item_request.filled_status):
      db_session.close()
      return NOT_FOUND

    elif (check_password_hash(user.password, password)):
      owner_user = db_session.query(UserTable).filter_by(id=int(item_request.requester_id)).first()

      corrected_data = {
        'title': item_request.name + ': #' + str(item_request.offers),
        'blurb': request.get_json()['description'],
        'user_ids': [user.id, owner_user.id],
        'photo': "",
        'purpose': "Request"
      }

      item_request.offers = item_request.offers + 1

      posted_data = ConversationTableSchema(only=('title','user_ids','blurb','purpose','photo',))\
        .load(corrected_data)
      conversation = ConversationTable(**posted_data, created_by="HTTP post request")

      db_session.add(conversation)
      db_session.commit()

      filename = "media/" + str(conversation.id) + "/" + "donation_image.png"

      bucket = S3_RESOURCE.Bucket(name='kula-donation-offers')
      bucket_object = S3_RESOURCE.Object(bucket_name=bucket.name, key=filename)
      bucket_object.put(Body=base64.b64decode(img),ACL='public-read')

      file_url = "https://{0}.s3.amazonaws.com/{1}".format(bucket.name,filename)

      conversation.photo = file_url
      conversation.item_request_id = item_request.id
      conversation.auth_user_id = owner_user.id
      conversation.search = item_request.name + ': #' + str(item_request.offers) + request.get_json()['description']

      db_session.commit()
      
      corrected_data_msg = {
        'sender_id': user.id,
        'conversation_id': conversation.id,
        'body': request.get_json()['description']
      }

      posted_msg_data = MessageTableSchema(only=('sender_id','conversation_id','body',))\
        .load(corrected_data_msg)
      msg = MessageTable(**posted_msg_data, created_by="HTTP post request")
      msg.item_request_id = item_request.id

      db_session.add(msg)
      db_session.commit()

      general_address = "Someone has offered to donate an item to fill your request, " + item_request.name + ". Log into <a href='https://kula.com/' >https://kula.com/</a> to see the item they offered and determine whether that will meet your needs."
      body_html = """<html><p>Hello """ + owner_user.first_name + """,</p><p>""" + general_address + """</p><p>If you have any questions or concerns, feel free to contact us at support@kula.com.</p><p>Best,</p><p>Kula Team</p></html>"""

      try:
        SES_CLIENT.send_email(
          Destination={
            'ToAddresses': [
              owner_user.email,
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
              'Data': "Someone made you a donation offer!",
            },
          },
          Source="support@kula.com",
        )

      except ClientError:
        return NOT_FOUND

      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED
    
  def put(self):
    pass

  def delete(self):
    pass