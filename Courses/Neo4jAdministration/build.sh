#!/usr/bin/env bash

convert () {
  adoc_file="$1"
  echo "converting $adoc_file"
  # redirect url depends on the stage
  if [[ "${STAGE}" == "prod" ]]; then
    redirect_url="https://neo4j.com/graphacademy/online-training/neo4j-administration/"
  else
    redirect_url="https://neo4j.com/graphacademy/online-training/neo4j-administration-dev/"
  fi
  asciidoctor -a "section-titles=Intro to Neo4j,Overview Of Admin,Managing a DB,Causal Clustering,Security,Monitoring,The End" \
              -a "module-title=Neo4j GraphAcademy: Neo4j Administration" \
              -a "module-id=neo4j-administration" \
              -a "module-redirect-url=${redirect_url}" \
              -a "module-intercom-event=training-neo4j-admin-view" \
              -a "module-class-js-url=${CLASS_JS_URL}" \
              -a "module-quizes-js-url=${QUIZES_JS_URL}" \
              -a "imagedir=${IMG}" \
              -T "../_templates_v2" \
              "adoc/${adoc_file}" -D html
}

convert "00_AboutThisCourse.adoc"
convert "01_IntroductionToNeo4j.adoc"
convert "02_OverviewOfNeo4jAdministration.adoc"
convert "03_ManagingANeo4jDatabase.adoc"
convert "04_CausalClusteringInNeo4j.adoc"
convert "05_SecurityInNeo4j.adoc"
convert "06_MonitoringNeo4j.adoc"
convert "07_Summary.adoc"
