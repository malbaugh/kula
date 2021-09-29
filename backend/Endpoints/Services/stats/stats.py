# coding=utf-8

from os import path
from Configuration.config import SERIALIZER
from flask_restful import Resource
from Configuration.config import DB_SESSION
from werkzeug.security import check_password_hash
from Models.Users.users.user import UserTable, UserTableSchema
from Models.Items.items.item import ItemTable
from Models.Requests.requests.request import RequestTable
from Statuses.statuses import NO_CONTENT, NOT_FOUND
from flask import jsonify

class Stats(Resource):
	def get(self):
		db_session = DB_SESSION()

		# db_session.query(UserTable).filter_by(email="buynothin@gmail.com").delete()
		# db_session.query(UserTable).filter_by(email="dane@predictivewear.com").delete()
		# db_session.commit()

		# org = db_session.query(UserTable).filter_by(email="dane@kula.com").first()
		# org.organization = True
		# db_session.commit()

		# users_changes = db_session.query(UserTable).all()
		# for user in users_changes:
		# 	user.organization = False
		# items_changes = db_session.query(ItemTable).all()
		# for item in items_changes:
		# 	item.sponsored = False
		# db_session.commit()

		# emails = []
		# first_names = []
		# last_names = []

		# users_changes = db_session.query(UserTable).all()
		# for user in users_changes:
		# 	emails.append(user.email)
		# 	first_names.append(user.first_name)
		# 	last_names.append(user.last_name)

		# users_schema = UserTableSchema(many=True, exclude=('password','address','state','zipcode'))
		# users_data = users_schema.dump(users_changes)

		users = db_session.query(UserTable).count()
		verified_users = db_session.query(UserTable).filter_by(email_confirmed=True,organization=False).count()
		verified_org_users = db_session.query(UserTable).filter_by(email_confirmed=True,organization=True).count()
		items = db_session.query(ItemTable).count()
		claimed_items = db_session.query(ItemTable).filter_by(claimed_status=True, taken_status=False).count()
		taken_items = db_session.query(ItemTable).filter_by(taken_status=True).count()

		request_items = db_session.query(RequestTable).count()
		covered_requests = db_session.query(RequestTable).filter_by(covered_status=True).count()
		filled_requests = db_session.query(RequestTable).filter_by(filled_status=True).count()

		data = [users, verified_users, verified_org_users, items, claimed_items, taken_items, request_items, covered_requests, filled_requests]
		# data = [emails, first_names, last_names]
		response = jsonify(data)
		response.status_code = 200
		db_session.close()
		return response

	def post(self):
		pass

	def put(self):
		pass

	def delete(self):
		pass