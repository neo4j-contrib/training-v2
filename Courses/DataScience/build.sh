#!/usr/bin/env bash
set -e

# load config
. ./module.config

# load functions
. ../_bin/functions.sh

convert_adoc "00_AboutThisCourse.adoc"
convert_adoc "01_SettingUpYourDevelopmentEnvironment.adoc"
convert_adoc "02_ExploratoryDataAnalysis.adoc"
convert_adoc "03_Recommendations.adoc"
convert_adoc "04_Predictions.adoc"
convert_adoc "05_Summary.adoc"
