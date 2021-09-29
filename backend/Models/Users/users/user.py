# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from Models.entity import Entity
from Configuration.config import DB_SESSION, ENGINE, BASE
from marshmallow import Schema, fields
import random, string

class UserTable(Entity, BASE):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zipcode = Column(Float)
    rating = Column(Float)
    organization = Column(Boolean)
    
    email_confirmed = Column(Boolean)
    
    search = Column(String)

    def __init__(self, first_name, last_name, organization, email, password, address, city, state, zipcode, created_by):
        Entity.__init__(self, created_by)
        self.email = email
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.organization = organization
        self.address = address
        self.city = city
        self.state = state
        self.zipcode = zipcode
        self.email_confirmed = False
        self.rating = 0

class UserTableSchema(Schema):
    id = fields.Number()
    
    email = fields.Str()
    password = fields.Str()
    first_name = fields.Str()
    last_name = fields.Str()
    address = fields.Str()
    city = fields.Str()
    state = fields.Str()
    zipcode = fields.Number()
    rating = fields.Number()

    email_confirmed = fields.Boolean()
    organization = fields.Boolean()

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()