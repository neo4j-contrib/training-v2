#!/bin/bash
export IMG='https://graphacademy.neo4j.com/img/applied-graph-algos'
STAGE='dev'

while [ "$1" != "" ]; do
    case $1 in
        -s | --stage )           shift
                                STAGE=$1
                                ;;
    esac
    shift
done

echo "Publishing JS---"
export QUIZES_JS_URL=`python2 publish_js.py --stage $STAGE --file quizes.js`
echo -e "\t$QUIZES_JS_URL"
export CLASS_JS_URL=`python2 publish_js.py --stage $STAGE --file class.js`
echo -e "\t$CLASS_JS_URL"

echo "Building webpages---"
./build.sh
echo "Publishing---"
echo "-- copying images"
aws s3 sync --acl public-read img/ s3://graphacademy.neo4j.com/img/applied-graph-algos/
echo "-- copying wordpress"
python2 ./publish.py --stage $STAGE
