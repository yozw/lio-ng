#!/bin/bash

function error {
  echo "[`date`] ERROR: $1" > /dev/stderr
  exit 1
}

function log {
  echo "[`date`] $1"
}
