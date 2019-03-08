asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/00_AboutThisCourse.adoc -o html/00_AboutThisCourse.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/01_IntroductionToNeo4j.adoc -o html/01_IntroductionToNeo4j.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/02_OverviewOfNeo4jAdministration.adoc -o html/02_OverviewOfNeo4jAdministration.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/03_ManagingANeo4jDatabase.adoc -o html/03_ManagingANeo4jDatabase.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/04_CausalClusteringInNeo4j.adoc -o html/04_CausalClusteringInNeo4j.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/05_SecurityInNeo4j.adoc -o html/05_SecurityInNeo4j.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/06_MonitoringNeo4j.adoc -o html/06_MonitoringNeo4j.html
asciidoctor -a CLASS_JS_URL=$CLASS_JS_URL -a QUIZES_JS_URL=$QUIZES_JS_URL -a imagedir=$IMG -T _templates_v2 adoc/07_Summary.adoc -o html/07_Summary.html
