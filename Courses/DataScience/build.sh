#!/usr/bin/env bash
convert () {
  adoc_file="$1"
  echo "converting $adoc_file"
  asciidoctor -a "section-titles=Dev Env,EDA,Recommendations,Predictions,The End" \
              -a "module-title=Neo4j GraphAcademy: Data Science with Neo4j" \
              -a "module-id=datascience" \
              -a "CLASS_JS_URL=${CLASS_JS_URL}" \
              -a "QUIZES_JS_URL=${QUIZES_JS_URL}" \
              -a "imagedir=${IMG}" \
              -T "../_templates_v2" \
              "adoc/${adoc_file}" -D html
}

convert "00_AboutThisCourse.adoc"
convert "01_SettingUpYourDevelopmentEnvironment.adoc"
convert "02_ExploratoryDataAnalysis.adoc"
convert "03_Recommendations.adoc"
convert "04_Predictions.adoc"
convert "05_Summary.adoc"
