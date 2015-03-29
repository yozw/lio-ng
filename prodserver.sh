#!/usr/bin/env bash
# Do a full build and start the production server locally.
# The code is minified and served from the appengine/ directory.

ROOT=$(cd "$(dirname "$0")"; pwd)
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"

./make.sh || error "Make failed"

~/google_appengine/dev_appserver.py appengine/app.yaml || error "Could not start production server locally"
