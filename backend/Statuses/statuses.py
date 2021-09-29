# coding=utf-8

from flask import jsonify

# 200 Series
NO_CONTENT = jsonify("")
NO_CONTENT.status_code = 204

# 400 Series
BAD_REQUEST = jsonify("Error: Bad Syntax.")
BAD_REQUEST.status_code = 400

UNAUTHORIZED = jsonify("ERROR: You are unauthorized.")
UNAUTHORIZED.status_code = 401

FORBIDDEN = jsonify("ERROR: Resource unavailable right now.")
FORBIDDEN.status_code = 403

NOT_FOUND = jsonify("ERROR: Resource not found.")
NOT_FOUND.status_code = 404

CONFLICT = jsonify("ERROR: Conflict in request.")
CONFLICT.status_code = 409