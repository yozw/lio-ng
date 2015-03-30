#!/bin/bash
IN="bootstrap.css"
OUT="bootstrap-modified.css"
echo "// Modified version of bootstrap.css for lio-ng" > $OUT
echo "// This is a generated file. Do not edit." >> $OUT
echo >> $OUT

cat $IN >> $OUT

sed -i -e 's/@media (max-width: 767px)/@media (max-width: 127px)/g' $OUT
sed -i -e 's/@media (min-width: 768px)/@media (min-width: 128px)/g' $OUT

