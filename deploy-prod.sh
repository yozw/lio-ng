#!/usr/bin/env bash
# Do a full build and deploy to the production server

ROOT=$(cd "$(dirname "$0")"; pwd)
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"

checkDeps gae

./make.sh || error "Make failed"

python $(get_appengine_path)/appcfg.py --noauth_local_webserver \
    --oauth2 -A online-optimizer update $ROOT/appengine \
    || error "Deployment failed"

