#!/bin/bash
ROOT=$(cd "$(dirname "$0")"; pwd)
source ${ROOT}/common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"

VERSION=`date +%Y%m%d%H%M%S`
DEST="${ROOT}/appengine"

log "Building binary version ${VERSION} ..."

checkDeps python sed uglifyjs pip

if [ ! -d ${DEST}/python ]; then
  log "Installing python requirements ..."
  pip install -r requirements.txt -t ${DEST}/python
fi

log "Copying files to ${DEST} ..."

cd src/
CPIO_OPT="--quiet -pdmu"
find application -name '*.html'   | cpio $CPIO_OPT $DEST || error "Error copying files"
find application -name '*.css'    | cpio $CPIO_OPT $DEST || error "Error copying files"
find css -name '*.css'            | cpio $CPIO_OPT $DEST || error "Error copying files"
find lib -name '*.min.js'         | cpio $CPIO_OPT $DEST || error "Error copying files"
find lib -name '*.css'            | cpio $CPIO_OPT $DEST || error "Error copying files"
find lib -name '*.woff'           | cpio $CPIO_OPT $DEST || error "Error copying files"
find lib -name '*.ttf'            | cpio $CPIO_OPT $DEST || error "Error copying files"
find models -name '*.mod'         | cpio $CPIO_OPT $DEST || error "Error copying files"
find images -name '*.png'         | cpio $CPIO_OPT $DEST || error "Error copying files"
find images -name '*.gif'         | cpio $CPIO_OPT $DEST || error "Error copying files"
cp *.yaml $DEST                                          || error "Error copying files"
cp *.py $DEST                                            || error "Error copying files"
cd ..

log "Updating version app.yaml ..."
sed -i -e "s/^version: 1/version: ${VERSION}/g" ${DEST}/app.yaml || error "Error running sed"

log "Minifying code ..."
python minify.py || error "Could not minify code"

log "Done"
