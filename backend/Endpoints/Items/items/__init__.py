from flask import Blueprint
from flask_restful import Api

from .register import RegisterItem
from .update import UpdateItem
from .select_user_claim import SelectUserClaim
from .repost import RepostItem
from .taken import MarkItemTaken
from .search import SearchItems
from .delete import Delete
from .create_claim import CreateClaim

items_blueprint = Blueprint('item_api', __name__)

item_api = Api(items_blueprint)

item_api.add_resource(RegisterItem, '/list-item')
item_api.add_resource(Delete, '/item-<item_id>/delete')
item_api.add_resource(UpdateItem, '/item/update')
item_api.add_resource(SelectUserClaim, '/item/select-user')
item_api.add_resource(RepostItem, '/item/repost')
item_api.add_resource(MarkItemTaken, '/item/taken')
item_api.add_resource(SearchItems, '/items/search')
item_api.add_resource(CreateClaim, '/claim-item')