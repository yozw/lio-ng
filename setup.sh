#!/usr/bin/env bash
ROOT=`dirname $0`
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"

checkDeps pip

pip install -r requirements.txt -t src/python
# wget -nc https://github.com/yui/yuicompressor/releases/download/v2.4.8/yuicompressor-2.4.8.jar
