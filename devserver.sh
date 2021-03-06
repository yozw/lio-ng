#!/usr/bin/env bash
# Start the development server locally. The code is served from the src/ directory.

ROOT=$(cd "$(dirname "$0")"; pwd)
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"

checkDeps gae

log "Starting development server"
python $(get_appengine_path)/dev_appserver.py src/app.yaml || error "Could not start development server locally"
