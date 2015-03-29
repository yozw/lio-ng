#!/bin/bash

if [ -t 1 ]; then
  NCOLOR=$(tput colors)

  if test -n "$NCOLOR" && test $NCOLOR -ge 8; then
      COLOR_DEFAULT=`tput sgr0`
      COLOR_RED=`tput setaf 1`
      COLOR_GREEN=`tput setaf 2`
  fi
fi

function error {
  echo "[`date`] ${COLOR_RED}ERROR: $1${COLOR_DEFAULT}" > /dev/stderr
  exit 1
}

function log {
  echo "[`date`] ${COLOR_GREEN}$1${COLOR_DEFAULT}"
}

function checkDeps {
  for package in "$@"; do
    if [ $package == "pip" ]; then
      pip --version > /dev/null    || error "Please install pip."
    elif [ $package == "wget" ]; then
      wget --version > /dev/null   || error "Please install wget."
    elif [ $package == "gae" ]; then
      if [ ! -f ~/google_appengine/dev_appserver.py ]; then
        error "Please install Google App Engine in ~/google_appengine/"
      fi
    elif [ $package == "uglifyjs" ]; then
      uglifyjs --version > /dev/null  || error "Please install UglifyJS."
    elif [ $package == "python" ]; then
      python --version 2> /dev/null   || error "Please install Python."
    elif [ $package == "sed" ]; then
      sed --version > /dev/null   || error "Please install sed."
    else
      error "Unknown dependency: $package"
    fi
  done
}
