#!/usr/bin/env bash
set -e

# load config
. ./module.config

# load functions
. ../_bin/functions.sh

convert_enrollment "index.part.adoc"
convert_course "00_AboutThisCourse.adoc"
convert_course "01_IntroductionToNeo4j.adoc"
convert_course "02_OverviewOfNeo4jAdministration.adoc"
convert_course "03_ManagingANeo4jDatabase.adoc"
convert_course "04_CausalClusteringInNeo4j.adoc"
convert_course "05_SecurityInNeo4j.adoc"
convert_course "06_MonitoringNeo4j.adoc"
convert_course "07_Summary.adoc"
