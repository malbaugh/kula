from flask import Blueprint
from flask_restful import Api

# from .update_photo import UpdatePhoto
from .update import UpdateUser
from .update_password import UpdatePassword
from .register import Register
from .login import Login

users_blueprint = Blueprint('users_api', __name__)

users_api = Api(users_blueprint)

# users_api.add_resource(UpdatePhoto, '/users/photo')
users_api.add_resource(UpdatePassword, '/users/update-password')
users_api.add_resource(UpdateUser, '/users/update')
users_api.add_resource(Register, '/users/register')
users_api.add_resource(Login, '/login')