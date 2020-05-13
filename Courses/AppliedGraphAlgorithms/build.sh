#!/usr/bin/env bash

convert () {
  adoc_file="$1"
  # redirect url depends on the stage
  if [[ "${STAGE}" == "prod" ]]; then
    redirect_url="https://neo4j.com/graphacademy/online-training/applied-graph-algorithms/"
  else
    redirect_url="https://neo4j.com/graphacademy/online-training/applied-algos-dev/"
  fi
  echo "converting $adoc_file"
  asciidoctor -a "section-titles=Setup,Category Hierarchy,Ordering Search Results,Relevant Reviews,Photo Based Recommendations,Summary" \
              -a "module-title=Neo4j GraphAcademy: Applied Graph Algorithms" \
              -a "quiz-module-count=${QUIZ_MODULE_COUNT}" \
              -a "localstorage-prefix-key=${LOCALSTORAGE_PREFIX_KEY}" \
              -a "module-id=applied-algos" \
              -a "module-redirect-url=${redirect_url}" \
              -a "module-intercom-event=training-applied-algos-view" \
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
