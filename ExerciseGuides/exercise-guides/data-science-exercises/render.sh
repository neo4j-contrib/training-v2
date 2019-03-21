echo "Usage: sh render.sh [publish]"
GUIDES=neo4j-guides

function render {
$GUIDES/run.sh Exercises.adoc index.html +1 "$@"
$GUIDES/run.sh 01.adoc 01.html +1 "$@"
}

if [ "$1" == "publish" ]; then
  URL=guides.neo4j.com/data-science-exercises
  render https://$URL -a csv-url=https://guides.neo4j.com/data-science-exercises -a env-training
  if hash aws 2>/dev/null; then
	  aws s3 cp --acl public-read --recursive --exclude "*" --include "*.html" --include "*.png" --include "*.jpg" --include "*.gif" --include "*.csv" ./ s3://${URL}/
	  aws s3 cp --acl public-read index.html s3://${URL}
  else
   # ${URL}/?cachebust=123456
  	s3cmd put --recursive -P *.html img s3://${URL}/
  	s3cmd put -P index.html s3://${URL}
  fi
  echo "Publication Done"
elif [ "$1" == "render-only" ]; then
  URL=guides.neo4j.com/data-science-exercises
  render http://$URL
else
  URL=localhost:8001/data-science-exercises
  render http://$URL -a csv-url=file:/// -a env-training
  echo "Starting Websever at $URL Ctrl-c to stop"
  cd ..
  python ../$GUIDES/http-server.py
fi
