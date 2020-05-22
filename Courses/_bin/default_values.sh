#!/usr/bin/env bash

if [[ -z "${STAGE}" ]]; then
  STAGE="dev"
fi
if [[ -z "${ENROLLMENT_JS_URL}" ]]; then
  ENROLLMENT_JS_URL="https://cdn.neo4jlabs.com/graphacademy/${STAGE}/enrollment.js"
fi
if [[ -z "${COURSE_JS_URL}" ]]; then
  COURSE_JS_URL="https://cdn.neo4jlabs.com/graphacademy/${STAGE}/course.js"
fi
if [[ -z "${S3_PROFILE}" ]]; then
  S3_PROFILE="default"
fi
