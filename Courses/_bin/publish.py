from base64 import b64encode
import json
import requests
import sys
import os
import flask
import sys, getopt
import boto3
from flask import render_template
import imp

'''
Get page content
'''
def get_page_content(filename, base_dir):
  file = open("%s/html/%s" % (base_dir, filename))
  return file.read()

'''
Update wordpress page
'''
def update_wordpress_page(pageId, content):
  url = "https://neo4j.com/wp-json/wp/v2/pages/%d" % (pageId)
  auth = "{}:{}".format(os.getenv("PUBLISH_DOCS_USERNAME"), os.getenv("PUBLISH_DOCS_PASSWORD"))
  auth_encoded = b64encode(auth.encode("utf-8"))
  headers = {
    "Accept": "application/json",
    "Authorization": "Basic {}".format(auth),
  }

  r = requests.get(url, headers=headers)
  response = json.loads(r.content)

  # build response for update
  response["content"] = content
  headers["Content-Type"] = "application/json"
  print("\t%s" % (url))
  pr = requests.post(url, headers=headers, data=json.dumps(response))

  return pr.content


def main(argv):
  stage = "dev"
  base_dir = None
  try:
    opts, args = getopt.getopt(argv,"h",["stage=", "base-dir="])
  except getopt.GetoptError:
     print("publish.py --stage <stage> --base-dir /path/to/course")
     sys.exit(2)
  for opt, arg in opts:
    if opt == "-h":
      print("publish.py --stage <stage>")
      sys.exit()
    elif opt in ("--stage"):
      stage = arg
    elif opt in ("--base-dir"):
      base_dir = arg
  print("Stage is '%s' with base directory '%s'" % (stage, base_dir))

  if base_dir is None:
    print("Base directory is mandatory.")
    print("publish.py --stage <stage> --base-dir /path/to/course")
    sys.exit(2)

  if stage != "dev" and stage != "prod":
    print("Stage '%s' is invalid. Currently, only 'prod' and 'dev' are supported." % stage)
    sys.exit(2)

  if True:
    with open("%s/wordpress_config.json" % base_dir) as json_file:
      wordpress_config = json.load(json_file)

    if wordpress_config:
      for key, value in wordpress_config.items():
        print("Publishing %s:" % (key))
        pageContent = update_wordpress_page(value[stage], get_page_content(key, base_dir))
    else:
      print("Cannot import WordPress configuration: " + os.getenv("PUBLISH_DOCS_CONFIG"))
      sys.exit()
  else:
    print("Environment variables for PUBLISH_DOCS_USERNAME, PUBLISH_DOCS_PASSWORD and PUBLISH_DOCS_CONFIG must be set")
    sys.exit()

if __name__ == "__main__":
   main(sys.argv[1:])
