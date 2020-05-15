#!/bin/bash
set -e

# load config
. ./module.config

# load functions
. ../_bin/functions.sh

while [[ "$1" != "" ]]; do
  case $1 in
    -s | --stage )
      shift
      STAGE=$1
    ;;
  esac
    shift
done

current_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# publish quizes.js and class.js
publish_js

echo "Building webpages---"
./build.sh

echo "Publishing---"
copy_images_s3 "${current_dir}/img/" "s3://graphacademy.neo4j.com/img/applied-graph-algos/"
publish_wordpress "${current_dir}"
