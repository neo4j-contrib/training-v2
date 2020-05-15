#!/usr/bin/env bash

# load config
. ./module.config

# default value
if [[ -z "${STAGE}" ]]; then
  STAGE="dev"
fi
if [[ -z "${CLASS_JS_URL}" ]]; then
  CLASS_JS_URL="https://cdn.neo4jlabs.com/graphacademy/${STAGE}/class.js"
fi
if [[ -z "${QUIZES_JS_URL}" ]]; then
  QUIZES_JS_URL="https://cdn.neo4jlabs.com/graphacademy/${STAGE}/quizes.js"
fi

convert () {
  adoc_file="$1"
  # redirect url depends on the stage
  if [[ "${STAGE}" == "prod" ]]; then
    redirect_url="${REDIRECT_URL_PROD}"
  else
    redirect_url="${REDIRECT_URL_DEV}"
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

convert "00_AboutThisCourse.adoc"
convert "01_Setup.adoc"
convert "02_CategoryHierarchy.adoc"
convert "03_OrderingSearchResults.adoc"
convert "04_MostRelevantReviews.adoc"
convert "05_PhotoRecommendations.adoc"
convert "06_Summary.adoc"
