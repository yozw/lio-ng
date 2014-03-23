#!/bin/bash
pushd `dirname $0` > /dev/null
ROOT=`pwd`
popd > /dev/null

pushd $ROOT > /dev/null
 
find src -name '*.html' | cpio -pdmu $ROOT/appengine/static
find src -name '*.css' | cpio -pdmu $ROOT/appengine/static
find lib -name '*.min.js' | cpio -pdmu $ROOT/appengine/static
find lib -name '*.css' | cpio -pdmu $ROOT/appengine/static
find models -name '*.mod' | cpio -pdmu $ROOT/appengine/static

python minify.py 


