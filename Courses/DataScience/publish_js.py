from base64 import b64encode
import json
import requests
import sys
import os
import flask
import sys, getopt
import boto3
from flask import render_template

API_BASE_URL = {"dev": "https://9niagofhzb.execute-api.us-east-1.amazonaws.com/dev",
                "prod": "https://nmae7t4ami.execute-api.us-east-1.amazonaws.com/prod"}

fapp = flask.Flask('pub', template_folder='.')

'''
Get page content
'''
def get_page_content(filename):
  file = open('html/%s' % filename)
  return file.read()

'''
Publish file to S3 and get version
'''
def publish_app_js(stage, filename):
  global API_BASE_URL

  # Create an S3 client
  s3 = boto3.client('s3')

  with fapp.app_context():
    tmpl_vars = {'API_BASE_URL': API_BASE_URL[stage], 'STAGE': stage}
    rendered_content = render_template('js/' + filename, **tmpl_vars)

  f = s3.put_object(Body=bytes(rendered_content), Bucket='cdn.neo4jlabs.com', Key='graphacademy/data-science/' + stage + '/' + filename, ACL='public-read')
  print "https://cdn.neo4jlabs.com/graphacademy/data-science/%s/%s?versionId=%s" % (stage, filename, f['VersionId'])
  return f['VersionId']


def main(argv):
  stage = 'dev'
  try:
     opts, args = getopt.getopt(argv,"h",['stage=','file='])
  except getopt.GetoptError:
     print 'publish_js.py --stage <stage>'
     sys.exit(2)
  for opt, arg in opts:
     if opt == '-h':
        print 'publish_js.py --stage <stage>'
        sys.exit()
     elif opt in ("--file"):
        filename = arg
     elif opt in ("--stage"):
        stage = arg

  if stage <> 'dev' and stage <> 'prod':
    print "Stages 'prod' + 'dev' are only supported stages currently"
    sys.exit()

  publish_app_js(stage, filename)

if __name__ == "__main__":
   main(sys.argv[1:])
