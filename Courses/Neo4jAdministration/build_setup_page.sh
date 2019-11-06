
asciidoctor  adoc/SettingUpYourLaptop.adoc -o html/Neo4jAdmin_pre-class_Setup.html

asciidoctor-pdf -T s adoc/SettingUpYourLaptop.adoc -a allow-uri-read -a pdf-style=asciidoc-themes/setup.yml -o pdf/Neo4jAdmin_pre-class_Setup.pdf


open html/Neo4jAdmin_pre-class_Setup.html