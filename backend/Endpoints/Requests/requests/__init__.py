from flask import Blueprint
from flask_restful import Api

from .register import RegisterRequest
from .update import UpdateRequest
from .repost import RepostRequest
from .filled import MarkRequestFilled
from .search import SearchRequests
from .delete import Delete
from .accept_user_donation import AcceptUserDonation
from .offer_donation import OfferDonation

requests_blueprint = Blueprint('request_api', __name__)

request_api = Api(requests_blueprint)

request_api.add_resource(RegisterRequest, '/request-item')
request_api.add_resource(Delete, '/request-<item_request_id>/delete')
request_api.add_resource(UpdateRequest, '/request/update')
request_api.add_resource(RepostRequest, '/request/repost')
request_api.add_resource(MarkRequestFilled, '/request/filled')
request_api.add_resource(SearchRequests, '/requests/search')
request_api.add_resource(AcceptUserDonation, '/requests/select-user')
request_api.add_resource(OfferDonation, '/offer-donation')