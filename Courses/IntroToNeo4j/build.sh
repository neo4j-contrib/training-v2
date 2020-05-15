#!/usr/bin/env bash
set -e

# load config
. ./module.config

# load functions
. ../_bin/functions.sh

convert_adoc "00_AboutThisCourse.adoc"
convert_adoc "01_IntroductionToGraphDatabases.adoc"
convert_adoc "02_IntroductionToNeo4j.adoc"
convert_adoc "03_SettingUpYourDevelopmentEnvironment.adoc"
convert_adoc "04_IntroductionToCypher.adoc"
convert_adoc "05_GettingMoreOutOfQueries.adoc"
convert_adoc "06_CreatingNodesAndRelationships.adoc"
convert_adoc "07_GettingMoreOutOfNeo4j.adoc"
convert_adoc "08_Summary.adoc"
