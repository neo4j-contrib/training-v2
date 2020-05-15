#!/usr/bin/env bash
set -e

# load config
. ./module.config

# load functions
. ../_bin/functions.sh

convert_enrollment "index.part.adoc"
convert_course "00_AboutThisCourse.adoc"
convert_course "01_SettingUpYourDevelopmentEnvironment.adoc"
convert_course "02_ExploratoryDataAnalysis.adoc"
convert_course "03_Recommendations.adoc"
convert_course "04_Predictions.adoc"
convert_course "05_Summary.adoc"
