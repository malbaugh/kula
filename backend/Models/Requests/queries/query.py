# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from Models.entity import Entity
from Configuration.config import DB_SESSION, ENGINE, BASE
from Models.sqlal_mutable_array import MutableList
from marshmallow import Schema, fields

class RequestQueryTable(Entity, BASE):
    __tablename__ = 'request-queries'

    id = Column(Integer, primary_key=True)
    
    query = Column(String)
    searcher_id = Column(Integer)
    zipcode = Column(Float)
    city = Column(String)
    state = Column(String)
    filled_status = Column(Boolean)
    covered_status = Column(Boolean)
    requester_id = Column(Integer)
    date_posted = Column(DateTime)
    
    def __init__(self):
        Entity.__init__(self, "HTTP get request")

class RequestQueryTableSchema(Schema):
    id = fields.Number()

    searcher_id = fields.Number()
    query = fields.Str()
    city = fields.Str()
    state = fields.Str()
    zipcode = fields.Number()
    filled_status = fields.Boolean()
    covered_status = fields.Boolean()
    requester_id = fields.Number()
    date_posted = fields.DateTime()

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()