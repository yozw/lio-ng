#!/bin/bash
ROOT=$(cd "$(dirname "$0")"; pwd)
source ${ROOT}/../../common.sh || exit 1
cd ${ROOT} || error "Could not change to directory $ROOT"

pdflatex "\def\lw{1.5pt}\input{favicon.tex}"
convert -transparent white favicon.pdf -resize 16x16\! favicon-16.png
pdflatex "\def\lw{1.25pt}\input{favicon.tex}"
convert -transparent white favicon.pdf -resize 24x24\! favicon-24.png
pdflatex "\def\lw{1.0pt}\input{favicon.tex}"
convert -transparent white favicon.pdf -resize 32x32\! favicon-32.png
pdflatex "\def\lw{0.5pt}\input{favicon.tex}"
convert -transparent white favicon.pdf -resize 64x64\! favicon-64.png
icotool -o favicon.ico -c favicon-16.png favicon-24.png favicon-32.png favicon-64.png

