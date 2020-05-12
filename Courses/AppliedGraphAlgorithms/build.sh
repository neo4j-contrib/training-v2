#!/usr/bin/env bash

CLASS_JS_URL="https://cdn.neo4jlabs.com/graphacademy/applied-algos/dev/class.js?versionId=glirJfbTycBxPeL8b7ThzWTlxCMJqNcn"
QUIZES_JS_URL="https://cdn.neo4jlabs.com/graphacademy/applied-algos/dev/quizes.js?versionId=39.9.3V_TSiax1LoZcVsRG.7mwvgmXB8"
IMG="https://graphacademy.neo4j.com/img/applied-graph-algos"

convert () {
  adoc_file="$1"
  echo "converting $adoc_file"
  asciidoctor -a "section-titles=Setup,Category Hierarchy,Ordering Search Results,Relevant Reviews,Photo Based Recommendations,Summary" \
              -a "module-title=Neo4j GraphAcademy: Applied Graph Algorithms" \
              -a "CLASS_JS_URL=${CLASS_JS_URL}" \
              -a "QUIZES_JS_URL=${QUIZES_JS_URL}" \
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
