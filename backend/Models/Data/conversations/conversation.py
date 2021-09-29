# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from Models.entity import Entity
from Configuration.config import DB_SESSION, ENGINE, BASE
from marshmallow import Schema, fields
import random, string
from Models.sqlal_mutable_array import MutableList
from sqlalchemy.dialects.postgresql import ARRAY

class ConversationTable(Entity, BASE):
    __tablename__ = 'conversations'

    id = Column(Integer, primary_key=True)
    user_ids = Column(MutableList.as_mutable(ARRAY(Integer)))

    item_request_id = Column(Integer)
    item_id = Column(Integer)
    auth_user_id = Column(Integer)

    photo = Column(String)
    title = Column(String)
    blurb = Column(String)
    purpose = Column(String)

    disabled = Column(Boolean)
    complete = Column(Boolean)

    search = Column(String)

    def __init__(self, user_ids, photo, title, blurb, purpose, created_by):
        Entity.__init__(self, created_by)
        self.user_ids = user_ids
        self.photo = photo
        self.title = title
        self.blurb = blurb
        self.purpose = purpose
        self.disabled = False
        self.complete = False

class ConversationTableSchema(Schema):
    id = fields.Number()
    user_ids = fields.List(fields.Number())
    auth_user_id = fields.Number()
    item_id = fields.Number()
    item_request_id = fields.Number()
    photo = fields.Str()
    title = fields.Str()
    blurb = fields.Str()
    purpose = fields.Str()
    disabled = fields.Boolean()
    complete = fields.Boolean()

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()