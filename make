#!/bin/bash
pushd `dirname $0` > /dev/null
ROOT=`pwd`
popd > /dev/null

pushd $ROOT > /dev/null

CPIO_OPT="--quiet -pdmu"

echo "Copying files ..."
find src -name '*.html' | cpio $CPIO_OPT $ROOT/appengine/static 
find src -name '*.css' | cpio $CPIO_OPT $ROOT/appengine/static
find lib -name '*.min.js' | cpio $CPIO_OPT $ROOT/appengine/static
find lib -name '*.css' | cpio $CPIO_OPT $ROOT/appengine/static
find models -name '*.mod' | cpio $CPIO_OPT $ROOT/appengine/static
find images -name '*.png' | cpio $CPIO_OPT $ROOT/appengine/static
find images -name '*.gif' | cpio $CPIO_OPT $ROOT/appengine/static

python minify.py 


