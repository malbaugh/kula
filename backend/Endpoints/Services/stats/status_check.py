# coding=utf-8

from os import path
from Configuration.config import SERIALIZER
from flask_restful import Resource
from Configuration.config import DB_SESSION
from werkzeug.security import check_password_hash
from Models.Users.users.user import UserTable, UserTableSchema
from Models.Items.items.item import ItemTable
from Models.Requests.requests.request import RequestTable
from Statuses.statuses import NO_CONTENT
from flask import jsonify

class StatusCheck(Resource):
	def get(self):
		response = jsonify("")
		response.status_code = 200
		return response

	def post(self):
		response = jsonify("")
		response.status_code = 200
		return response

	def put(self):
		response = jsonify("")
		response.status_code = 200
		return response

	def delete(self):
		response = jsonify("")
		response.status_code = 200
		return response