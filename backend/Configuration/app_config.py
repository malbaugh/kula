import os

class Config(object):
	# SECRET_KEY = 'development-key'
	SECRET_KEY = os.environ['SECRET_KEY']
	FLASK_ENV = 'production'
	DEBUG = False
	TESTING = False