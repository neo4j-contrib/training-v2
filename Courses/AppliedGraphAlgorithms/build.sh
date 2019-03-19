asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/00_AboutThisCourse.adoc -o html/00_AboutThisCourse.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/01_Setup.adoc -o html/01_Setup.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/02_CategoryHierarchy.adoc -o html/02_CategoryHierarchy.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/03_OrderingSearchResults.adoc -o html/03_OrderingSearchResults.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/04_MostRelevantReviews.adoc -o html/04_MostRelevantReviews.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/05_PhotoRecommendations.adoc -o html/05_PhotoRecommendations.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/06_Summary.adoc -o html/06_Summary.html

