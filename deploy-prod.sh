#!/bin/bash

ROOT=`dirname $0`
source ${ROOT}/common.sh || exit 1

cd ${ROOT} || error "Could not change to directory $ROOT"

./make || error "Make failed"
~/google_appengine/appcfg.py \
    --oauth2 -A online-optimizer update $ROOT/appengine \
    || error "Deployment failed"

