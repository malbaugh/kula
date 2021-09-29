from flask import Blueprint
from flask_restful import Api

from .report import Report
from .verify_email import VerifyEmail

emails_blueprint = Blueprint('emails_api', __name__, template_folder='templates')

emails_api = Api(emails_blueprint)

emails_api.add_resource(Report,'/report')
emails_api.add_resource(VerifyEmail, '/verify-email/<token>')