#!/bin/bash
ROOT=$(cd "$(dirname "$0")"; pwd)
source ${ROOT}/../../common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"

pdflatex favicon.tex
convert -transparent white favicon.pdf -resize 16x16\! favicon.png

