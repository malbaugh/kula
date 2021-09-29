# coding=utf-8

from datetime import datetime
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import boto3
from itsdangerous import JSONWebSignatureSerializer

ENGINE = create_engine(os.environ['DB_URL'])
DB_SESSION = sessionmaker(bind=ENGINE)

SERIALIZER = JSONWebSignatureSerializer(os.environ['SECRET_KEY'])

S3_RESOURCE = boto3.resource('s3',aws_access_key_id=os.environ['AWS_ACCESS_KEY'],aws_secret_access_key=os.environ['AWS_SECRET_KEY'])
SES_CLIENT = boto3.client('ses',region_name='us-east-1',aws_access_key_id=os.environ['AWS_ACCESS_KEY'],aws_secret_access_key=os.environ['AWS_SECRET_KEY'])
S3_CLIENT = boto3.client('s3',aws_access_key_id=os.environ['AWS_ACCESS_KEY'],aws_secret_access_key=os.environ['AWS_SECRET_KEY'])

BASE = declarative_base()