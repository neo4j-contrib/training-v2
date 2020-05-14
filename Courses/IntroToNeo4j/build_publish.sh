#!/bin/bash
export LOCALSTORAGE_PREFIX_KEY='com.neo4j.graphacademy.intro-v2.'
export QUIZ_MODULE_COUNT=7

if [[ -z "$S3_PROFILE" ]]; then
  S3_PROFILE="default"
fi

echo "Publishing JS---"
export QUIZES_JS_URL=`python2 ../_lib/publish_js.py --stage "prod" --file quizes.js`
echo -e "\t$QUIZES_JS_URL"
export CLASS_JS_URL=`python2 ../_lib/publish_js.py --stage "prod" --file class.js`
echo -e "\t$CLASS_JS_URL"

echo "Building webpages---"
./build.sh
echo "Publishing---"
python2 ./publish.py
