#!/bin/bash
export IMG='https://graphacademy.neo4j.com/img/neo4j-administration'
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
export QUIZES_JS_URL=`python publish_js.py --stage $STAGE --file quizes.js`
echo -e "\t$QUIZES_JS_URL"
export CLASS_JS_URL=`python publish_js.py --stage $STAGE --file class.js`
echo -e "\t$CLASS_JS_URL"

echo "Building webpages---"
./build.sh
echo "Publishing---"
echo "-- copying images"
aws s3 sync --acl public-read img/ s3://graphacademy.neo4j.com/img/neo4j-administration/
echo "-- copying wordpress"
python ./publish.py --stage $STAGE
