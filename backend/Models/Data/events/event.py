# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from Models.entity import Entity
from Configuration.config import DB_SESSION, ENGINE, BASE
from marshmallow import Schema, fields
import random, string

class EventTable(Entity, BASE):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    action = Column(String)
    description = Column(String)
    story = Column(String)
    ip_address = Column(String)

    def __init__(self, action, description, story, ip_address, created_by):
        Entity.__init__(self, created_by)
        self.action = action
        self.description = description
        self.story = story
        self.ip_address = ip_address

class EventTableSchema(Schema):
    id = fields.Number()
    user_id = fields.Number()
    action = fields.Str()
    description = fields.Str()
    story = fields.Str()
    ip_address = fields.Str()

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()