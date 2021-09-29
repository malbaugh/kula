# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from Models.entity import Entity
from Configuration.config import DB_SESSION, ENGINE, BASE
from marshmallow import Schema, fields
import random, string

class FavoriteItemTable(BASE):
    __tablename__ = 'favorite-items'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    item_id = Column(Integer)
    date = Column(DateTime)

    def __init__(self, user_id, item_id, date):
        self.user_id = user_id
        self.item_id = item_id
        self.date = date

class FavoriteItemTableSchema(Schema):
    id = fields.Number()
    user_id = fields.Number()
    item_id = fields.Number()
    date = fields.DateTime()