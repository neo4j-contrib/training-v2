#!/bin/bash

# load config
. ./module.config

# default values
if [[ -z "${STAGE}" ]]; then
  STAGE="dev"
fi
if [[ -z "${CLASS_JS_URL}" ]]; then
  CLASS_JS_URL="https://cdn.neo4jlabs.com/graphacademy/${STAGE}/class.js"
fi
if [[ -z "${QUIZES_JS_URL}" ]]; then
  QUIZES_JS_URL="https://cdn.neo4jlabs.com/graphacademy/${STAGE}/quizes.js"
fi
if [[ -z "${S3_PROFILE}" ]]; then
  S3_PROFILE="default"
fi

while [[ "$1" != "" ]]; do
  case $1 in
    -s | --stage )
      shift
      STAGE=$1
    ;;
  esac
    shift
done

echo "Publishing JS---"
QUIZES_JS_URL=`python2 ../_lib/publish_js.py --stage $STAGE --file quizes.js`
if [[ $? != 0 ]]; then
  echo $?
  echo "ABORTING - Unable to publish quizes.js"
  exit 1
else
  export QUIZES_JS_URL
fi
echo -e "\t$QUIZES_JS_URL"
CLASS_JS_URL=`python2 ../_lib/publish_js.py --stage $STAGE --file class.js`
if [[ $? != 0 ]]; then
  echo "ABORTING - Unable to publish class.js"
  exit 1
else
  export CLASS_JS_URL
fi
echo -e "\t$CLASS_JS_URL"

echo "Building webpages---"
./build.sh
echo "Publishing---"
echo "-- copying images"
aws s3 sync --acl public-read img/ s3://graphacademy.neo4j.com/img/applied-graph-algos/ --profile "$S3_PROFILE"
echo "-- copying wordpress"
python2 ./publish.py --stage $STAGE
