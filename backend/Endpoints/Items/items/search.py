# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Configuration.config import DB_SESSION, SERIALIZER
from Models.Items.items.item import ItemTable, ItemTableSchema
from Models.Items.queries.query import ItemQueryTable, ItemQueryTableSchema
from Models.Data.conversations.conversation import ConversationTable
from datetime import datetime
from Models.Users.users.user import UserTable
from sqlalchemy.sql.expression import func
from Statuses.statuses import BAD_REQUEST
from werkzeug.security import check_password_hash
from sqlalchemy import desc

class SearchItems(Resource):
  def get(self):
    db_session = DB_SESSION()

    query_item = ItemQueryTable()

    item_owner = False
    active_user = False
    try:
      token = request.headers.get("Authorization")
      email = SERIALIZER.loads(token)['email']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(UserTable).filter_by(email=email).first()
      query_item.searcher_id = user.id
      active_user = True

      conversations = db_session.query(ConversationTable).filter(func.array_to_string(ConversationTable.user_ids,',','*').ilike('%' + str(user.id) + '%')).all()
      item_ids = []
      for conversation in conversations:
        if (conversation.item_id != None):
          item_ids.append(conversation.item_id)

    except:
      active_user = False
      
    item_objects = db_session.query(ItemTable)

    if (request.args.get('query')):
      query_item.query = request.args.get('query')
      search = request.args.get('query').split(' ')
      
      for word in search:
        item_objects = item_objects.filter(ItemTable.search.ilike('%' + word + '%'))
    
    if (request.args.get('ownerId') and active_user):
      query_item.owner_id = request.args.get('ownerId')
      if (email == user.email and check_password_hash(user.password, password)):
        item_objects = item_objects.filter(ItemTable.owner_id == request.args.get('ownerId'))
        item_owner = True
      else:
        db_session.close()
        return BAD_REQUEST

    elif (active_user):
      item_objects = item_objects.filter(ItemTable.owner_id != user.id)

      if (not item_owner):
        for item_id in item_ids:
          item_objects = item_objects.filter(ItemTable.id != item_id)
    
    if (request.args.get('taken')):
      if (request.args.get('taken')=="true"):
        item_objects = item_objects.filter(ItemTable.taken_status == True)
        query_item.taken_status = True
      else:
        item_objects = item_objects.filter(ItemTable.taken_status == False)
        query_item.taken_status = False

    if (request.args.get('claimed')):
      if (request.args.get('claimed')=="true"):
        item_objects = item_objects.filter(ItemTable.claimed_status == True)
        query_item.claimed_status = True
      else:
        item_objects = item_objects.filter(ItemTable.claimed_status == False)
        query_item.claimed_status = False
        
    if (request.args.get('city')):
      item_objects = item_objects.filter(ItemTable.city == request.args.get('city'))
      query_item.city = request.args.get('city')

    if (request.args.get('state')):
      item_objects = item_objects.filter(ItemTable.state == request.args.get('state'))
      query_item.state = request.args.get('state')

    if (request.args.get('zipcode')):
      item_objects = item_objects.filter(ItemTable.zipcode == request.args.get('zipcode'))
      query_item.zipcode = request.args.get('zipcode')

    if (request.args.get('datePosted')):
      item_objects = item_objects.filter(ItemTable.created_at <= request.args.get('datePosted'))
      query_item.date_posted = request.args.get('datePosted')

    if (not item_owner):
      item_objects = item_objects.order_by(func.random())
      item_schema = ItemTableSchema(many=True, exclude=('selected_user_id','owner_id','instructions',))
    else:
      item_objects = item_objects.order_by(desc(ItemTable.updated_at))
      item_schema = ItemTableSchema(many=True, exclude=('selected_user_id','owner_id',))
    
    items = item_schema.dump(item_objects)

    db_session.add(query_item)
    db_session.commit()
    db_session.close()
    
    response = jsonify(items)
    response.status_code = 200
    return response

  def post(self):
    pass
    
  def put(self):
    pass

  def delete(self):
    pass