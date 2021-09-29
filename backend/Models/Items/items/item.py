# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from Models.entity import Entity
from Configuration.config import DB_SESSION, ENGINE, BASE
from Models.sqlal_mutable_array import MutableList
from marshmallow import Schema, fields

class ItemTable(Entity, BASE):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True)
    
    name = Column(String)
    photo = Column(String)
    city = Column(String)
    state = Column(String)
    zipcode = Column(Float)
    description = Column(String)
    instructions = Column(String)
    claimed_status = Column(Boolean)
    taken_status = Column(Boolean)
    owner_id = Column(Integer)
    sponsored = Column(Boolean)
    selected_user_id = Column(Integer)
    approved = Column(Boolean)
    claimed_at = Column(DateTime)

    search = Column(String)
    favorites = Column(Integer)
    claims = Column(Integer)
    
    def __init__(self, name, photo, city, state, zipcode, description, owner_id, created_by):
        Entity.__init__(self, created_by)
        self.name = name
        self.photo = photo
        self.city = city
        self.state = state
        self.zipcode = zipcode
        self.description = description
        self.owner_id = owner_id
        self.claimed_status = False
        self.taken_status = False
        self.approved = True
        self.favorites = 0
        self.claims = 0

class ItemTableSchema(Schema):
    id = fields.Number()

    name = fields.Str()
    photo = fields.Str()
    city = fields.Str()
    state = fields.Str()
    zipcode = fields.Number()
    description = fields.Str()
    instructions = fields.Str()
    claimed_status = fields.Boolean()
    taken_status = fields.Boolean()
    owner_id = fields.Number()
    selected_user_id = fields.Number()
    sponsored = fields.Boolean()
    approved = fields.Boolean()
    claimed_at = fields.DateTime()

    favorites = fields.Number()
    claims = fields.Number()

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()