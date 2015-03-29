#!/usr/bin/env bash
# Do a full build and deploy to the test server

ROOT=$(cd "$(dirname "$0")"; pwd)
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"

./make.sh || error "Make failed"

~/google_appengine/appcfg.py \
    --oauth2 -A online-optimizer-test update $ROOT/appengine \
    || error "Deployment failed"

