# coding=utf-8

from os import path
from Configuration.config import SERIALIZER
from flask_restful import Resource
from Configuration.config import DB_SESSION
from werkzeug.security import check_password_hash
from Models.Items.queries.query import ItemQueryTable, ItemQueryTableSchema
from Statuses.statuses import NO_CONTENT, NOT_FOUND
from flask import jsonify

class Queries(Resource):
	def get(self):
		db_session = DB_SESSION()

		search_objs = db_session.query(ItemQueryTable).all()
		search_schema = ItemQueryTableSchema(many=True)

		searches = search_schema.dump(search_objs)
		
		response = jsonify(searches)
		response.status_code = 200
		db_session.close()
		return response

	def post(self):
		pass

	def put(self):
		pass

	def delete(self):
		pass