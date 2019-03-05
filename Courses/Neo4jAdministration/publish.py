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
  pageContent = update_wordpress_page(92932, get_page_content('00_AboutThisCourse.html'))
  pageContent = update_wordpress_page(92935, get_page_content('01_IntroductionToNeo4j.html'))
  pageContent = update_wordpress_page(92937, get_page_content('02_OverviewOfNeo4jAdministration.html'))
  pageContent = update_wordpress_page(92939, get_page_content('03_ManagingANeo4jDatabase.html'))
  pageContent = update_wordpress_page(92941, get_page_content('04_CausalClusteringInNeo4j.html'))
  pageContent = update_wordpress_page(92943, get_page_content('05_SecurityInNeo4j.html'))
  pageContent = update_wordpress_page(92945, get_page_content('06_MonitoringNeo4j.html'))
  pageContent = update_wordpress_page(92947, get_page_content('07_Summary.html'))
else:
  print "Environment varisbles for PUBLISH_DOCS_USERNAME and PUBLISH_DOCS_PASSWORD must be set"
  sys.exit()
