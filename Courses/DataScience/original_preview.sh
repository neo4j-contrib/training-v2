echo "Rendering Cypher Training"
asciidoctor -T s cypher/index_60-Minute-Cypher.adoc -o cypher/index_wp.html
asciidoctor -T s cypher/part*.adoc -o cypher/
asciidoctor -a image=$IMG -a env-training -T s/parts cypher/part*.adoc -D cypher/html/
echo "Rendering Production Training"
asciidoctor -T s production/index_neo4j_in_production.adoc -o production/index_wp.html
open cypher/index_wp.html
echo "open production/index_wp.html"
