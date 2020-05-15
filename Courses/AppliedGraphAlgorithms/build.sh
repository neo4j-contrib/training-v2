#!/usr/bin/env bash
set -e

# load config
. ./module.config

# load functions
. ../_bin/functions.sh

convert_adoc "00_AboutThisCourse.adoc"
convert_adoc "01_Setup.adoc"
convert_adoc "02_CategoryHierarchy.adoc"
convert_adoc "03_OrderingSearchResults.adoc"
convert_adoc "04_MostRelevantReviews.adoc"
convert_adoc "05_PhotoRecommendations.adoc"
convert_adoc "06_Summary.adoc"
