#!/usr/bin/env bash
set -e

# load config
. ./module.config

# load functions
. ../_bin/functions.sh

convert_enrollment "index.part.adoc"
convert_course "00_AboutThisCourse.adoc"
convert_course "01_IntroductionToGraphDatabases.adoc"
convert_course "02_IntroductionToNeo4j.adoc"
convert_course "03_SettingUpYourDevelopmentEnvironment.adoc"
convert_course "04_IntroductionToCypher.adoc"
convert_course "05_GettingMoreOutOfQueries.adoc"
convert_course "06_CreatingNodesAndRelationships.adoc"
convert_course "07_GettingMoreOutOfNeo4j.adoc"
convert_course "08_Summary.adoc"
