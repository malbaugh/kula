# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from Models.entity import Entity
from Configuration.config import DB_SESSION, ENGINE, BASE
from marshmallow import Schema, fields
import random, string

class MessageTable(Entity, BASE):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer)
    sender_id = Column(Integer)
    body = Column(String)
    read = Column(Boolean)

    def __init__(self, sender_id, conversation_id, body, created_by):
        Entity.__init__(self, created_by)
        self.sender_id = sender_id
        self.conversation_id = conversation_id
        self.body = body
        self.read = False

class MessageTableSchema(Schema):
    id = fields.Number()
    sender_id = fields.Number()
    conversation_id = fields.Number()
    body = fields.Str()
    read = fields.Boolean()

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()