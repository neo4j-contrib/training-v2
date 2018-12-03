from base64 import b64encode
import json
import requests
import sys
import os

'''
Get page content
'''
def get_page_content(filename):
  file = open('html/%s' % filename)
  return file.read()

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
    print url
    pr = requests.post(url, headers=headers, data=json.dumps(response))
     
    return pr.content

if 'PUBLISH_DOCS_USERNAME' in os.environ and 'PUBLISH_DOCS_PASSWORD' in os.environ:
  pageContent = update_wordpress_page(88656, get_page_content('00_AboutThisCourse.html'))
  pageContent = update_wordpress_page(88159, get_page_content('01_IntroductionToGraphDatabases.html'))
  pageContent = update_wordpress_page(88161, get_page_content('02_IntroductionToNeo4j.html'))
  pageContent = update_wordpress_page(88163, get_page_content('03_SettingUpYourDevelopmentEnvironment.html'))
  pageContent = update_wordpress_page(88165, get_page_content('04_IntroductionToCypher.html'))
  pageContent = update_wordpress_page(88167, get_page_content('05_GettingMoreOutOfQueries.html'))
  pageContent = update_wordpress_page(88169, get_page_content('06_CreatingNodesAndRelationships.html'))
  pageContent = update_wordpress_page(88171, get_page_content('07_GettingMoreOutOfNeo4j.html'))
  pageContent = update_wordpress_page(88694, get_page_content('08_Summary.html'))
else:
  print "Environment varisbles for PUBLISH_DOCS_USERNAME and PUBLISH_DOCS_PASSWORD must be set"
  sys.exit()
