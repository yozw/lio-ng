#!/bin/bash
ROOT=$(cd "$(dirname "$0")"; pwd)
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"


uglifyjs --version > /dev/null  || error "Please install UglifyJS."
python --version 2> /dev/null   || error "Please install Python."


CPIO_OPT="--quiet -pdmu"
DEST="${ROOT}/appengine/"
log "Copying files to ${DEST} ..."

cd src/
find application -name '*.html'   | cpio $CPIO_OPT $DEST || error "Error copying files"
find css -name '*.css'            | cpio $CPIO_OPT $DEST || error "Error copying files"
find lib -name '*.min.js'         | cpio $CPIO_OPT $DEST || error "Error copying files"
find lib -name '*.css'            | cpio $CPIO_OPT $DEST || error "Error copying files"
find models -name '*.mod'         | cpio $CPIO_OPT $DEST || error "Error copying files"
find images -name '*.png'         | cpio $CPIO_OPT $DEST || error "Error copying files"
find images -name '*.gif'         | cpio $CPIO_OPT $DEST || error "Error copying files"
cp *.yaml $DEST                                          || error "Error copying files"
cp *.py $DEST                                            || error "Error copying files"
cd ..

log "Minifying code ..."
python minify.py || error "Could not minify code"

log "Done"
