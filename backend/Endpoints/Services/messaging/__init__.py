from flask import Blueprint
from flask_restful import Api

# from .report import Report
# from .stats import Stats
from .number_unread import UnreadMessages
from .send import SendMessage
from .read import MarkMessageRead
from .search import SearchMessages

messages_blueprint = Blueprint('messages_api', __name__)

messages_api = Api(messages_blueprint)

messages_api.add_resource(MarkMessageRead,'/message/read')
messages_api.add_resource(SearchMessages,'/messages/search')
messages_api.add_resource(SendMessage,'/message/send')
messages_api.add_resource(UnreadMessages,'/message/unread')
# messages_api.add_resource(Report,'/report')
# messages_api.add_resource(Stats, '/site-stats')
# messages_api.add_resource(VerifyEmail, '/verify-email/<token>')