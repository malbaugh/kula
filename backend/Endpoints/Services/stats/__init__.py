from flask import Blueprint
from flask_restful import Api

from .stats import Stats
from .status_check import StatusCheck
from .queries import Queries
from .item_requests import Requests
from .new_event import NewEvent
from .events import Events

stats_blueprint = Blueprint('stats_api', __name__)

stats_api = Api(stats_blueprint)

stats_api.add_resource(StatusCheck,'/')
stats_api.add_resource(Queries,'/search-stats')
stats_api.add_resource(Requests,'/request-stats')
stats_api.add_resource(Stats, '/site-stats')
stats_api.add_resource(NewEvent, '/event')
stats_api.add_resource(Events, '/event-stats')
