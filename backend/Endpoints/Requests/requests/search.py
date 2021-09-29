# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Configuration.config import DB_SESSION, SERIALIZER
from Models.Requests.requests.request import RequestTable, RequestTableSchema
from Models.Requests.queries.query import RequestQueryTable, RequestQueryTableSchema
from Models.Data.conversations.conversation import ConversationTable
from datetime import datetime
from Models.Users.users.user import UserTable
from sqlalchemy.sql.expression import func
from Statuses.statuses import BAD_REQUEST
from werkzeug.security import check_password_hash
from sqlalchemy import desc

class SearchRequests(Resource):
  def get(self):
    db_session = DB_SESSION()

    query_requested_item = RequestQueryTable()

    requester = False
    active_user = False
    try:
      token = request.headers.get("Authorization")
      email = SERIALIZER.loads(token)['email']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(UserTable).filter_by(email=email).first()
      query_requested_item.searcher_id = user.id
      active_user = True

      conversations = db_session.query(ConversationTable).filter(func.array_to_string(ConversationTable.user_ids,',','*').ilike('%' + str(user.id) + '%')).all()
      item_request_ids = []
      for conversation in conversations:
        if (conversation.item_request_id != None):
          item_request_ids.append(conversation.item_request_id)

    except:
      active_user = False
      
    requested_item_objects = db_session.query(RequestTable)

    if (request.args.get('query')):
      query_requested_item.query = request.args.get('query')
      search = request.args.get('query').split(' ')
      
      for word in search:
        requested_item_objects = requested_item_objects.filter(RequestTable.search.ilike('%' + word + '%'))
    
    if (request.args.get('requesterId') and active_user):
      query_requested_item.requester_id = request.args.get('requesterId')
      if (email == user.email and check_password_hash(user.password, password)):
        requested_item_objects = requested_item_objects.filter(RequestTable.requester_id == request.args.get('requesterId'))
        requester = True
      else:
        db_session.close()
        return BAD_REQUEST

    elif (active_user):
      requested_item_objects = requested_item_objects.filter(RequestTable.requester_id != user.id)

      if (not requester):
        for item_request_id in item_request_ids:
          requested_item_objects = requested_item_objects.filter(RequestTable.id != item_request_id)
    
    if (request.args.get('filled')):
      if (request.args.get('filled')=="true"):
        requested_item_objects = requested_item_objects.filter(RequestTable.filled_status == True)
        query_requested_item.filled_status = True
      else:
        requested_item_objects = requested_item_objects.filter(RequestTable.filled_status == False)
        query_requested_item.filled_status = False

    if (request.args.get('covered')):
      if (request.args.get('covered')=="true"):
        requested_item_objects = requested_item_objects.filter(RequestTable.covered_status == True)
        query_requested_item.covered_status = True
      else:
        requested_item_objects = requested_item_objects.filter(RequestTable.covered_status == False)
        query_requested_item.covered_status = False
        
    if (request.args.get('city')):
      requested_item_objects = requested_item_objects.filter(RequestTable.city == request.args.get('city'))
      query_requested_item.city = request.args.get('city')

    if (request.args.get('state')):
      requested_item_objects = requested_item_objects.filter(RequestTable.state == request.args.get('state'))
      query_requested_item.state = request.args.get('state')

    if (request.args.get('zipcode')):
      requested_item_objects = requested_item_objects.filter(RequestTable.zipcode == request.args.get('zipcode'))
      query_requested_item.zipcode = request.args.get('zipcode')

    if (request.args.get('datePosted')):
      requested_item_objects = requested_item_objects.filter(RequestTable.created_at <= request.args.get('datePosted'))
      query_requested_item.date_posted = request.args.get('datePosted')

    if (not requester):
      requested_item_objects = requested_item_objects.order_by(func.random())
    else:
      requested_item_objects = requested_item_objects.order_by(desc(RequestTable.updated_at))
      
    requested_item_schema = RequestTableSchema(many=True, exclude=('donor_id','requester_id',))
    requested_items = requested_item_schema.dump(requested_item_objects)

    db_session.add(query_requested_item)
    db_session.commit()
    db_session.close()
    
    response = jsonify(requested_items)
    response.status_code = 200
    return response

  def post(self):
    pass
    
  def put(self):
    pass

  def delete(self):
    pass