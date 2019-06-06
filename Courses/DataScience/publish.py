from base64 import b64encode
import json
import requests
import sys
import os
import flask
import sys, getopt
import boto3
from flask import render_template


WP_PAGE_IDS = { "index.part.html": {"dev": 94349, "prod": 98573},
                "00_AboutThisCourse.html": {"dev": 94351, "prod": 98576},
                "01_SettingUpYourDevelopmentEnvironment.html": {"dev": 94357, "prod": 98579},
                "02_ExploratoryDataAnalysis.html": {"dev": 94417, "prod": 98581},
                "03_Recommendations.html": {"dev": 94419, "prod": 98583},
                "04_Predictions.html": {"dev": 94421, "prod": 98585},
                "05_Summary.html": {"dev": 94423, "prod": 98587}
              }

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

  f = s3.put_object(Body=bytes(rendered_content), Bucket='cdn.neo4jlabs.com', Key='graphacademy/datascience/' + stage + '/' + filename, ACL='public-read')
  print "\t\thttps://cdn.neo4jlabs.com/graphacademy/datascience/%s/%s?versionId=%s" % (stage, filename, f['VersionId'])
  return f['VersionId']


'''
Update wordpress page
'''
def update_wordpress_page(pageId, content):
    url = 'https://neo4j.com/wp-json/wp/v2/pages/%d' % (pageId)
    auth = b64encode('{}:{}'.format(os.getenv('PUBLISH_DOCS_USERNAME'), os.getenv('PUBLISH_DOCS_PASSWORD')))
    headers = {
        'Accept': 'application/json',
        'Authorization': 'Basic {}'.format(auth),
    }

    r = requests.get(url, headers=headers)
    response = json.loads(r.content)

    # build response for update
    response['content'] = content
    headers['Content-Type'] = 'application/json'
    print "\t%s" % (url)
    pr = requests.post(url, headers=headers, data=json.dumps(response))

    return pr.content


def main(argv):
  stage = 'dev'
  try:
     opts, args = getopt.getopt(argv,"h",['stage='])
  except getopt.GetoptError:
     print 'publish.py --stage <stage>'
     sys.exit(2)
  for opt, arg in opts:
     if opt == '-h':
        print 'publish.py --stage <stage>'
        sys.exit()
     elif opt in ("--stage"):
        stage = arg
  print 'Stage is "%s"' % (stage)

  if stage <> 'dev' and stage <> 'prod':
    print "Stages 'prod' + 'dev' are only supported stages currently"
    sys.exit()

  if 'PUBLISH_DOCS_USERNAME' in os.environ and 'PUBLISH_DOCS_PASSWORD' in os.environ:
    # skip publishing JS as we'll publish separately before building web so asciidoc has URLs
    for key, value in WP_PAGE_IDS.iteritems():
      print "Publishing %s:" % (key)
      pageContent = update_wordpress_page(value[stage], get_page_content(key))
  else:
    print "Environment varisbles for PUBLISH_DOCS_USERNAME and PUBLISH_DOCS_PASSWORD must be set"
    sys.exit()

if __name__ == "__main__":
   main(sys.argv[1:])
