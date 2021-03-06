#!/bin/bash
TMPFILE=".gmpl.tmp"
OUTDIR="../../../appengine/doc/gmpl"
python pre_process_test.py

mkdir -p ${OUTDIR}

# Pre-process texinfo file
python pre_process.py > $TMPFILE

# Use makeinfo to turn pre-processed file into HTML files
makeinfo --html $TMPFILE --css-ref=../../lib/ui-bootstrap/bootstrap.css --css-include=custom.css -o $OUTDIR

# Do some post-processing
FILES=`find $OUTDIR | grep '\.html$'`

for FILE in $FILES; do
   sed -i -e 's$<a name="$<a class="anchor" name="$g' $FILE
   sed -i -e 's$<body>$<body><div id="content-wrapper"><div id="content">$g' $FILE
   sed -i -e 's$</body>$</div></div><body>$g' $FILE
done

