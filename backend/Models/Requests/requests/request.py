# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from Models.entity import Entity
from Configuration.config import DB_SESSION, ENGINE, BASE
from Models.sqlal_mutable_array import MutableList
from marshmallow import Schema, fields

class RequestTable(Entity, BASE):
    __tablename__ = 'requests'

    id = Column(Integer, primary_key=True)
    
    name = Column(String)
    photo = Column(String)
    city = Column(String)
    state = Column(String)
    zipcode = Column(Float)
    description = Column(String)
    covered_status = Column(Boolean)
    filled_status = Column(Boolean)
    requester_id = Column(Integer)
    donor_id = Column(Integer)
    approved = Column(Boolean)
    covered_at = Column(DateTime)

    search = Column(String)
    favorites = Column(Integer)
    offers = Column(Integer)
    
    def __init__(self, name, city, state, zipcode, description, requester_id, created_by):
        Entity.__init__(self, created_by)
        self.name = name
        self.city = city
        self.state = state
        self.zipcode = zipcode
        self.description = description
        self.requester_id = requester_id
        self.covered_status = False
        self.filled_status = False
        self.approved = True
        self.favorites = 0
        self.offers = 0

class RequestTableSchema(Schema):
    id = fields.Number()

    name = fields.Str()
    photo = fields.Str()
    city = fields.Str()
    state = fields.Str()
    zipcode = fields.Number()
    description = fields.Str()
    covered_status = fields.Boolean()
    filled_status = fields.Boolean()
    requester_id = fields.Number()
    donor_id = fields.Number()
    approved = fields.Boolean()
    covered_at = fields.DateTime()
    favorites = fields.Number()
    offers = fields.Number()

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()