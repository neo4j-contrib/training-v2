#!/usr/bin/env bash

current_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. "${current_dir}/default_values.sh"

convert_adoc () {
  local adoc_file="$1"
  # redirect url depends on the stage
  if [[ "${STAGE}" == "prod" ]]; then
    local redirect_url="${REDIRECT_URL_PROD}"
  else
    local redirect_url="${REDIRECT_URL_DEV}"
  fi
  echo "converting $adoc_file"
  asciidoctor -a "section-titles=${SECTION_TITLES}" \
              -a "module-title=${MODULE_TITLE}" \
              -a "module-quiz-count=${QUIZ_MODULE_COUNT}" \
              -a "module-localstorage-prefix-key=${LOCALSTORAGE_PREFIX_KEY}" \
              -a "module-id=${MODULE_ID}" \
              -a "module-redirect-url=${redirect_url}" \
              -a "module-intercom-event=${MODULE_INTERCOM_EVENT}" \
              -a "module-class-js-url=${CLASS_JS_URL}" \
              -a "module-quizes-js-url=${QUIZES_JS_URL}" \
              -a "imagedir=${IMG}" \
              -T "../_templates_v2" \
              "adoc/${adoc_file}" -D html
}

publish_js () {
  echo "Publishing JS---"
  local current_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
  local bin_dir="${current_dir}/../_bin"
  QUIZES_JS_URL=`python2 "${bin_dir}/publish_js.py" --stage "${STAGE}" --file quizes.js`
  if [[ $? != 0 ]]; then
    echo $?
    echo "ABORTING - Unable to publish quizes.js"
    exit 1
  else
    export QUIZES_JS_URL
  fi
  echo -e "\t$QUIZES_JS_URL"
  CLASS_JS_URL=`python2 "${bin_dir}/publish_js.py" --stage "${STAGE}" --file class.js`
  if [[ $? != 0 ]]; then
    echo "ABORTING - Unable to publish class.js"
    exit 1
  else
    export CLASS_JS_URL
  fi
  echo -e "\t$CLASS_JS_URL"
}

publish_wordpress () {
  echo "-- publishing to WordPress"
  local current_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
  local bin_dir="${current_dir}/../_bin"
  local base_dir="$1"
  python2 "${bin_dir}/publish.py" --stage "${STAGE}" --base-dir "${base_dir}"
}

copy_images_s3 () {
  echo "-- copying images to S3"
  src_dir="$1"
  destination_bucket="$2"
  echo -e "\t${src_dir} -> ${destination_bucket}"
  aws s3 sync --acl public-read "${src_dir}" "${destination_bucket}" --profile "${S3_PROFILE}"
}

build_publish () {
  local course_dir="$1"

  # publish quizes.js and class.js
  publish_js

  echo "Building webpages---"
  ${course_dir}/build.sh

  echo "Publishing---"
  if [[ -z "${S3_IMG_BUCKET}" ]]; then
    echo "INFO: Environment variable S3_IMG_BUCKET is undefined, skipping the copy images to S3..."
  else
    copy_images_s3 "${course_dir}/img/" "${S3_IMG_BUCKET}"
  fi
  publish_wordpress "${course_dir}"
}
