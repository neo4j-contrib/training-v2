#!/bin/bash
export IMG='https://graphacademy.neo4j.com/img/neo4j-administration'
echo "Building---"
./build.sh
echo "Publishing---"
echo "-- copying images"
aws s3 sync --acl public-read img/ s3://graphacademy.neo4j.com/img/neo4j-administration/
echo "-- copying wordpress"
python ./publish.py
