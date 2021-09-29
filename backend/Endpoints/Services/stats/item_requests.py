# coding=utf-8

from os import path
from Configuration.config import SERIALIZER
from flask_restful import Resource
from Configuration.config import DB_SESSION
from werkzeug.security import check_password_hash
from Models.Requests.queries.query import RequestQueryTable, RequestQueryTableSchema
from Statuses.statuses import NO_CONTENT, NOT_FOUND
from flask import jsonify

class Requests(Resource):
	def get(self):
		db_session = DB_SESSION()

		search_objs = db_session.query(RequestQueryTable).all()
		search_schema = RequestQueryTableSchema(many=True)

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