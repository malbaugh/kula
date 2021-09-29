# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Configuration.config import DB_SESSION, SES_CLIENT, SERIALIZER
from Models.Items.items.item import ItemTable
from Models.Users.users.user import UserTable
from Models.Data.conversations.conversation import ConversationTable
from werkzeug.security import check_password_hash
from datetime import datetime
from botocore.exceptions import ClientError
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT

class SelectUserClaim(Resource):
  def get(self):
    pass

  def post(self):
    pass
    
  def put(self):
    db_session = DB_SESSION()
    
    try:
      item_id = int(request.get_json()['item_id'])
      conversation_id = int(request.get_json()['conversation_id'])
      conversation = db_session.query(ConversationTable).filter_by(id=conversation_id).first()
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

        for uid in conversation.user_ids:
          if (uid != user.id):
            selected_user_id = uid

      except:
        db_session.close()
        return UNAUTHORIZED
        
    else: 
      db_session.close()
      return UNAUTHORIZED

    if (item == None or conversation == None):
      db_session.close()
      return NOT_FOUND

    owner_user = db_session.query(UserTable).filter_by(id=int(item.owner_id)).first()

    if (owner_user.id == user.id and check_password_hash(user.password, password)):
      item.claimed_status = True

      selected_user = db_session.query(UserTable).filter_by(id=selected_user_id).first()

      rejected_conversations = db_session.query(ConversationTable).filter_by(item_id=item.id).all()
      for convo in rejected_conversations:
        if (convo.id != conversation_id):
          convo.disabled = True
        else:
          convo.complete = True

      item.selected_user_id = selected_user_id
      item.claimed_at = datetime.now()
      item.updated_at = datetime.now()
      item.last_updated_by = "HTTP put request"

      if (owner_user.organization):
        general_address = "Congratulations! You asked for the item, " + item.name + ", and now the owner of the item has selected you to get the item. Since this item was sponsored by " + owner_user.first_name + ", you may go directly to go pick up the item. <b>Please consider thanking the organization on social media as they are providing items to the community for free! We want to support organizations who care about our communities.</b>"
        owners_address = owner_user.first_name + " is located at " + owner_user.address + " " + owner_user.city + ", " + owner_user.state + " " + str(int(owner_user.zipcode)) + ". Please be respectful of their specific instructions and ensure you are coming to get the item at an appropriate time. <b>The organization may revoke your claim at any time.</b>"
        instructions = "The owner of the item left some instructions when they listed the item: '" + item.instructions + "'"
        body_html = """<html><p>Hello """ + selected_user.first_name + """,</p><p>""" + general_address + """</p><p>""" + owners_address + """</p><p>""" + instructions + """</p><p>If you have any questions or concerns, feel free to contact us at support@kula.com.</p><p>Best,</p><p>Kula Team</p></html>"""

        try:
          SES_CLIENT.send_email(
            Destination={
              'ToAddresses': [
                selected_user.email,
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
                'Data': "Your item claim was accepted!",
              },
            },
            Source="support@kula.com",
          )

        except ClientError:
          return NOT_FOUND

      else:
        general_address = "Congratulations! You asked for the item, " + item.name + ", and now the owner of the item has selected you to get the item. Please be respectful of the owner's wishes and stipulations for picking up this item."
        owners_address = "We will let you decide how you would like to exchange the item. Log into <a href='https://kula.com/' >https://kula.com/</a> to figure out logistics with the the owner of the item, if they didn't provide enough details in their instructions. Please be respectful of their specific instructions and ensure you are coming to get the item at an appropriate time. <b>Once you and the owner of the item have agreed on a time for you to pick up the item, please be prompt. The owner of the item may revoke your claim at any time.</b>"
        instructions = "The owner of the item left some instructions when they listed the item: '" + item.instructions + "'"
        body_html = """<html><p>Hello """ + selected_user.first_name + """,</p><p>""" + general_address + """</p><p>""" + owners_address + """</p><p>""" + instructions + """</p><p>If you have any questions or concerns, feel free to contact us at support@kula.com.</p><p>Best,</p><p>Kula Team</p></html>"""

        try:
          SES_CLIENT.send_email(
            Destination={
              'ToAddresses': [
                selected_user.email,
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
                'Data': "Your item claim was accepted!",
              },
            },
            Source="support@kula.com",
          )

        except ClientError:
          return NOT_FOUND

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self):
    pass