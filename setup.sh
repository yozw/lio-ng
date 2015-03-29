#!/usr/bin/env bash
ROOT=`dirname $0`
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"


if [ ! -d src/python ]; then
  checkDeps pip
  log "Installing python requirements ..."
  pip install -r requirements.txt -t src/python
fi

# wget -nc https://github.com/yui/yuicompressor/releases/download/v2.4.8/yuicompressor-2.4.8.jar

log "Setup done"
