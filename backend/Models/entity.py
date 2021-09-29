# coding=utf-8

from datetime import datetime
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import boto3
from itsdangerous import JSONWebSignatureSerializer

class Entity():
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    last_updated_by = Column(String)

    def __init__(self, created_by):
        self.created_at = datetime.now() # UTC?
        self.updated_at = datetime.now()
        self.last_updated_by = created_by