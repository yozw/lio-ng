#!/usr/bin/env bash
# Do a full build and deploy to the production server

ROOT=$(cd "$(dirname "$0")"; pwd)
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"

checkDeps gae

./make.sh || error "Make failed"

gcloud app deploy --project online-optimizer appengine/app.yaml || error "Deployment failed"
