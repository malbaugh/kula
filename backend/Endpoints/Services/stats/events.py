# coding=utf-8

from os import path
from Configuration.config import SERIALIZER
from flask_restful import Resource
from Configuration.config import DB_SESSION
from werkzeug.security import check_password_hash
from Models.Data.events.event import EventTable, EventTableSchema
from Statuses.statuses import NO_CONTENT, NOT_FOUND
from flask import jsonify

class Events(Resource):
	def get(self):
		db_session = DB_SESSION()

		event_objs = db_session.query(EventTable).all()
		event_schema = EventTableSchema(many=True)

		events = event_schema.dump(event_objs)
		
		response = jsonify(events)
		response.status_code = 200
		db_session.close()
		return response

	def post(self):
		pass

	def put(self):
		pass

	def delete(self):
		pass