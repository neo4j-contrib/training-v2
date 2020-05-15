#!/usr/bin/env bash

if [[ -z "${STAGE}" ]]; then
  STAGE="dev"
fi
if [[ -z "${CLASS_JS_URL}" ]]; then
  CLASS_JS_URL="https://cdn.neo4jlabs.com/graphacademy/${STAGE}/class.js"
fi
if [[ -z "${QUIZES_JS_URL}" ]]; then
  QUIZES_JS_URL="https://cdn.neo4jlabs.com/graphacademy/${STAGE}/quizes.js"
fi
if [[ -z "${S3_PROFILE}" ]]; then
  S3_PROFILE="default"
fi
