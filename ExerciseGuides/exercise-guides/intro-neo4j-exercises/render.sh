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
$GUIDES/run.sh 08.adoc 08.html +1 "$@"
$GUIDES/run.sh 09.adoc 09.html +1 "$@"
$GUIDES/run.sh 10.adoc 10.html +1 "$@"
$GUIDES/run.sh 11.adoc 11.html +1 "$@"
$GUIDES/run.sh 12.adoc 12.html +1 "$@"
$GUIDES/run.sh 13.adoc 13.html +1 "$@"
$GUIDES/run.sh 14.adoc 14.html +1 "$@"
$GUIDES/run.sh 15.adoc 15.html +1 "$@"
$GUIDES/run.sh 16.adoc 16.html +1 "$@"
$GUIDES/run.sh 17.adoc 17.html +1 "$@"
$GUIDES/run.sh 18.adoc 18.html +1 "$@"
$GUIDES/run.sh 19.adoc 19.html +1 "$@"
}

if [ "$1" == "publish" ]; then
  URL=guides.neo4j.com/intro-neo4j-exercises
  render https://$URL -a csv-url=https://guides.neo4j.com/intro-neo4j-exercises -a env-training
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
  URL=guides.neo4j.com/intro-neo4j-exercises
  render http://$URL
else
  URL=localhost:8001/intro-neo4j-exercises
  render https://$URL -a csv-url=file:/// -a env-training
  echo "Starting Websever at $URL Ctrl-c to stop"
  cd ..
  python ../$GUIDES/http-server.py
fi
