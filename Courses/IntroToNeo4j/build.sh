#!/usr/bin/env bash
convert () {
  adoc_file="$1"
  echo "converting $adoc_file"
  asciidoctor -a "section-titles=Intro to Graph DBs,Intro to Neo4j,Dev Env,Cypher,Advanced Queries,Creating Data,More,The End" \
              -a "module-title=Neo4j GraphAcademy: Introduction to Neo4j" \
              -a "module-id=online-training-v2" \
              -a "module-redirect-url=https://neo4j.com/graphacademy/online-training/introduction-to-neo4j/" \
              -a "module-intercom-event=training-introv2-view" \
              -T "../_templates_v2" \
              "adoc/${adoc_file}" -D html
}

convert "00_AboutThisCourse.adoc"
convert "01_IntroductionToGraphDatabases.adoc"
convert "02_IntroductionToNeo4j.adoc"
convert "03_SettingUpYourDevelopmentEnvironment.adoc"
convert "04_IntroductionToCypher.adoc"
convert "05_GettingMoreOutOfQueries.adoc"
convert "06_CreatingNodesAndRelationships.adoc"
convert "07_GettingMoreOutOfNeo4j.adoc"
convert "08_Summary.adoc"
