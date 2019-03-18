asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/00_AboutThisCourse.adoc -o html/00_AboutThisCourse.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/01_CategoryHierarchy.adoc -o html/01_CategoryHierarchy.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/02_OrderingSearchResults.adoc -o html/02_OrderingSearchResults.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/03_MostRelevantReviews.adoc -o html/03_MostRelevantReviews.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/04_PhotoRecommendations.adoc -o html/04_PhotoRecommendations.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/05_Summary.adoc -o html/05_Summary.html

