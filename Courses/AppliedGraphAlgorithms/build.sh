#!/usr/bin/env bash
set -e

# load config
. ./module.config

# load functions
. ../_bin/functions.sh

convert_enrollment "index.part.adoc"
convert_course "00_AboutThisCourse.adoc"
convert_course "01_Setup.adoc"
convert_course "02_CategoryHierarchy.adoc"
convert_course "03_OrderingSearchResults.adoc"
convert_course "04_MostRelevantReviews.adoc"
convert_course "05_PhotoRecommendations.adoc"
convert_course "06_Summary.adoc"
