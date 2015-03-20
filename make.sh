#!/bin/bash
ROOT=`dirname $0`
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"


log "Copying files ..."
CPIO_OPT="--quiet -pdmu"
DEST="${ROOT}/appengine/static"
find src -name '*.html'   | cpio $CPIO_OPT $DEST || error "Error copying files"
find src -name '*.css'    | cpio $CPIO_OPT $DEST || error "Error copying files"
find lib -name '*.min.js' | cpio $CPIO_OPT $DEST || error "Error copying files"
find lib -name '*.css'    | cpio $CPIO_OPT $DEST || error "Error copying files"
find models -name '*.mod' | cpio $CPIO_OPT $DEST || error "Error copying files"
find images -name '*.png' | cpio $CPIO_OPT $DEST || error "Error copying files"
find images -name '*.gif' | cpio $CPIO_OPT $DEST || error "Error copying files"


log "Minifying code ..."
python minify.py || error "Could not minify code"

log "Done"
