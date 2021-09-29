# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Configuration.config import SES_CLIENT
from botocore.exceptions import ClientError
from Statuses.statuses import NO_CONTENT, NOT_FOUND

class Report(Resource):
  def get(self):
    pass

  def post(self):
    body_html = """<html><p>""" + request.get_json()['issue'] + """</p><p>""" + request.get_json()['email']+ """</p></html>"""

    try:
      SES_CLIENT.send_email(
        Destination={
          'ToAddresses': [
            "report@kula.com",
          ],
        },
        Message={
          'Body': {
            'Html': {
              'Charset': "UTF-8",
              'Data': body_html,
            },
          },
          'Subject': {
            'Charset': "UTF-8",
            'Data': "Automated Issue Report",
          },
        },
        Source="support@kula.com",
      )

    except ClientError:
      return NOT_FOUND

    else:
      return NO_CONTENT

  def put(self):
    pass

  def delete(self):
    pass