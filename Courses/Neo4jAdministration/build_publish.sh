#!/bin/bash
set -e

# load config
. ./module.config

# load functions
. ../_bin/functions.sh

while [[ "$1" != "" ]]; do
  case $1 in
    -s | --stage )
      shift
      STAGE=$1
    ;;
  esac
    shift
done

current_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
build_publish "${current_dir}"
