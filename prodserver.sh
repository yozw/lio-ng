#!/usr/bin/env bash
# Start the production server locally. The code is served from the appengine/ directory.
# Usage:
#   prodserver.sh [--build]
# Specifying the --build flag builds the server before starting it.

ROOT=$(cd "$(dirname "$0")"; pwd)
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"

checkDeps gae

if [ "$1" == "--build" ]; then
  ./make.sh || error "Make failed"
fi

log "Starting production server"
~/google_appengine/dev_appserver.py appengine/app.yaml || error "Could not start production server locally"
