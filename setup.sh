#!/usr/bin/env bash
ROOT=`dirname $0`
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"

pip --version > /dev/null    || error "Please install pip."
wget --version > /dev/null   || error "Please install wget."

pip install -r requirements.txt -t src/python
pip install -r requirements.txt -t appengine/python
# wget -nc https://github.com/yui/yuicompressor/releases/download/v2.4.8/yuicompressor-2.4.8.jar
