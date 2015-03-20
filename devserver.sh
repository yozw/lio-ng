#!/bin/bash
ROOT=`dirname $0`
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"


./make || error "Make failed"

~/google_appengine/dev_appserver.py appengine || error "Could not start development server"

