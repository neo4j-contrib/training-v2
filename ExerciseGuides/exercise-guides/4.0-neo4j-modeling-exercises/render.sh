echo "Usage: sh render.sh [publish]"
GUIDES=neo4j-guides

function render {
$GUIDES/run.sh Exercises.adoc index.html +1 "$@"
$GUIDES/run.sh 01.adoc 01.html +1 "$@"
$GUIDES/run.sh 02.adoc 02.html +1 "$@"
$GUIDES/run.sh 03.adoc 03.html +1 "$@"
$GUIDES/run.sh 04.adoc 04.html +1 "$@"
$GUIDES/run.sh 05.adoc 05.html +1 "$@"
$GUIDES/run.sh 06.adoc 06.html +1 "$@"
$GUIDES/run.sh 07.adoc 07.html +1 "$@"
}

if [ "$1" == "publish" ]; then
  URL=guides.neo4j.com/4.0-neo4j-modeling-exercises
  render https://$URL -a csv-url=https://guides.neo4j.com/4.0-neo4j-modeling-exercises -a env-training
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
  URL=guides.neo4j.com/4.0-neo4j-modeling-exercises
  render http://$URL
else
  URL=localhost:8001/4.0-neo4j-modeling-exercises
  render https://$URL -a csv-url=file:/// -a env-training
  echo "Starting Websever at $URL Ctrl-c to stop"
  cd ..
  python ../$GUIDES/http-server.py
fi
