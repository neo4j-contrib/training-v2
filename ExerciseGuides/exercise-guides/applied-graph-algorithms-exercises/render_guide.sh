#!/bin/bash

echo "Usage: sh render.sh [publish]"
GUIDES=../../neo4j-guides
# git clone http://github.com/jexp/neo4j-guides $GUIDES

function render {
  $GUIDES/run.sh index.adoc index.html +1 "$@"
  $GUIDES/run.sh 01_cypher_refresher.adoc 01_cypher_refresher.html +1 "$@"
  $GUIDES/run.sh 02_category_hierarchy.adoc 02_category_hierarchy.html +1 "$@"
  $GUIDES/run.sh 03_relevant_reviews.adoc 04_relevant_reviews.html +1 "$@"
  $GUIDES/run.sh 04_search_results.adoc 03_search_results.html +1 "$@"
  $GUIDES/run.sh 05_photo_recommendations.adoc 05_photo_recommendations.html +1 "$@"
}

# -a env-training is a flag to enable full content, if you comment it out, the guides are rendered minimally e.g. for a presentation
if [ "$1" == "publish" ]; then
  URL=guides.neo4j.com/applied_graph_algorithms
  render http://$URL -a env-training -a img=https://$URL/images
  s3cmd put --recursive -P *.html images s3://${URL}/
  s3cmd put -P index.html s3://${URL}
  echo "Publication Done"
else
  URL=localhost:8001
# copy the csv files to $NEO4J_HOME/import
  render http://$URL -a env-training -a img=http://$URL/images
  echo "Starting Websever at $URL Ctrl-c to stop"
  python $GUIDES/http-server.py
  # python -m SimpleHTTPServer
fi
