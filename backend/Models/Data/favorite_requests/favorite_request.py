# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from Models.entity import Entity
from Configuration.config import DB_SESSION, ENGINE, BASE
from marshmallow import Schema, fields
import random, string

class FavoriteItemRequestTable(BASE):
    __tablename__ = 'favorite-requests'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    item_request_id = Column(Integer)
    date = Column(DateTime)

    def __init__(self, user_id, item_request_id, date):
        self.user_id = user_id
        self.item_request_id = item_request_id
        self.date = date

class FavoriteItemRequestTableSchema(Schema):
    id = fields.Number()
    user_id = fields.Number()
    item_request_id = fields.Number()
    date = fields.DateTime()