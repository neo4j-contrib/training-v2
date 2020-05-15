#!/usr/bin/env bash
set -e

# load config
. ./module.config

# load functions
. ../_bin/functions.sh

convert_adoc "00_AboutThisCourse.adoc"
convert_adoc "01_IntroductionToNeo4j.adoc"
convert_adoc "02_OverviewOfNeo4jAdministration.adoc"
convert_adoc "03_ManagingANeo4jDatabase.adoc"
convert_adoc "04_CausalClusteringInNeo4j.adoc"
convert_adoc "05_SecurityInNeo4j.adoc"
convert_adoc "06_MonitoringNeo4j.adoc"
convert_adoc "07_Summary.adoc"
