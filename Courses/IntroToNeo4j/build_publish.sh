#!/bin/bash
#!/bin/bash
set -e

# load config
. ./module.config

# load functions
. ../_bin/functions.sh

# only prod environment
STAGE='prod'

current_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
build_publish "${current_dir}"
