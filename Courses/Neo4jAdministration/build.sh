#!/usr/bin/env bash

convert () {
  adoc_file="$1"
  echo "converting $adoc_file"
  asciidoctor -a "section-titles=Intro to Neo4j,Overview Of Admin,Managing a DB,Causal Clustering,Security,Monitoring,The End" \
              -a "module-title=Neo4j GraphAcademy: Neo4j Administration" \
              -a "module-id=neo4j-administration" \
              -a "CLASS_JS_URL=${CLASS_JS_URL}" \
              -a "QUIZES_JS_URL=${QUIZES_JS_URL}" \
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
