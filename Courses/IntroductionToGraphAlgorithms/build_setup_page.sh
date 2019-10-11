
asciidoctor  adoc/SettingUpYourDevelopmentEnvironment.adoc -o html/IntroGraphAlgos_pre-class_Setup.html

asciidoctor-pdf -T s adoc/SettingUpYourDevelopmentEnvironment.adoc -a allow-uri-read -a pdf-style=asciidoc-themes/01.yml -o pdf/SettingUpYourDevelopmentEnvironment.pdf

open  html/IntroGraphAlgos_pre-class_Setup.html