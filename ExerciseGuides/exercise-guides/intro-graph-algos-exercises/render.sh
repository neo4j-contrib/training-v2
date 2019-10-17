echo "Usage: sh render.sh [publish]"
GUIDES=neo4j-guides


function render {
$GUIDES/run.sh Exercises.adoc index.html +1 "$@"
$GUIDES/run.sh SetUpYourDevelopmentEnvironment.adoc SetUpYourDevelopmentEnvironment.html +1 "$@"
$GUIDES/run.sh WeaklyConnectedComponents.adoc WeaklyConnectedComponents.html +1 "$@"
$GUIDES/run.sh LabelPropagation.adoc LabelPropagation.html +1 "$@"
$GUIDES/run.sh LouvainModularity.adoc LouvainModularity.html +1 "$@"
$GUIDES/run.sh StronglyConnectedComponents.adoc StronglyConnectedComponents.html +1 "$@"
#$GUIDES/run.sh TriadicBalance.adoc TriadicBalance.html +1 "$@"
$GUIDES/run.sh TriangleCount.adoc TriangleCount.html +1 "$@"
$GUIDES/run.sh PageRank.adoc PageRank.html +1 "$@"
$GUIDES/run.sh Centrality.adoc Centrality.html +1 "$@"
$GUIDES/run.sh Pathfinding.adoc Pathfinding.html +1 "$@"
$GUIDES/run.sh Similarity.adoc Similarity.html +1 "$@"
$GUIDES/run.sh LinkPrediction.adoc LinkPrediction.html +1 "$@"
$GUIDES/run.sh MemoryRequirements.adoc MemoryRequirements.html +1 "$@"
}

if [ "$1" == "publish" ]; then
  URL=guides.neo4j.com/intro-graph-algos-exercises
  render https://$URL -a csv-url=https://guides.neo4j.com/intro-graph-algos-exercises -a env-training
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
  URL=guides.neo4j.com/intro-graph-algos-exercises
  render http://$URL
else
  URL=localhost:8001/intro-graph-algos-exercises
  render https://$URL -a csv-url=file:/// -a env-training
  echo "Starting Websever at $URL Ctrl-c to stop"
  cd ..
  python ../$GUIDES/http-server.py
fi
