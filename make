#!/bin/bash
pushd `dirname $0` > /dev/null
ROOT=`pwd`
popd > /dev/null

rsync -av --exclude=".*" --exclude="*~" $ROOT/lib $ROOT/appengine/static/
rsync -av --exclude=".*" --exclude="*~" $ROOT/src $ROOT/appengine/static/
rsync -av --exclude=".*" --exclude="*~" $ROOT/models $ROOT/appengine/static/

python minify.py 


