# coding=utf-8

from flask import Flask
from flask_cors import CORS
from Configuration.app_config import Config

application = Flask(__name__)
CORS(application)
application.config.from_object(Config) # Change to DevConfig for development

# This needed as these functions must access Flask functionalities
# only after Flask has been initialized.
with application.app_context():
  from Endpoints.Items.items import items_blueprint
  from Endpoints.Services.emailing import emails_blueprint
  from Endpoints.Services.messaging import messages_blueprint
  from Endpoints.Services.stats import stats_blueprint
  from Endpoints.Users.users import users_blueprint
  from Endpoints.Requests.requests import requests_blueprint

  application.register_blueprint(emails_blueprint)
  application.register_blueprint(messages_blueprint)
  application.register_blueprint(stats_blueprint)
  application.register_blueprint(items_blueprint)
  application.register_blueprint(requests_blueprint)
  application.register_blueprint(users_blueprint)

if __name__ == '__main__':
    application.run(host='0.0.0.0',port=80)
    # application.run(debug=True)