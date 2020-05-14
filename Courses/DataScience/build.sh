#!/usr/bin/env bash
convert () {
  adoc_file="$1"
  # redirect url depends on the stage
  if [[ "${STAGE}" == "prod" ]]; then
    redirect_url="https://neo4j.com/graphacademy/online-training/data-science/"
  else
    redirect_url="https://neo4j.com/graphacademy/online-training/data-science-dev/"
  fi
  echo "converting $adoc_file"
  asciidoctor -a "section-titles=Dev Env,EDA,Recommendations,Predictions,The End" \
              -a "module-title=Neo4j GraphAcademy: Data Science with Neo4j" \
              -a "module-id=datascience" \
              -a "module-redirect-url=${redirect_url}" \
              -a "module-intercom-event=training-data-science-view" \
              -a "module-class-js-url=${CLASS_JS_URL}" \
              -a "module-quizes-js-url=${QUIZES_JS_URL}" \
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
