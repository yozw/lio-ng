"""Lio-ng backend"""

import flask
import logging
import os
import urllib2
import string
import random
import config

from flask import Flask, request, make_response
from google.appengine.api import mail
from json_lib import ok, error, json_request
from time import gmtime, strftime
from modelstorage import ModelStorage

app = Flask(__name__)

def startApp():
  if config.PRODUCTION:
    logging.info("Running server in PRODUCTION mode")
  else:
    logging.info("Running server in DEVELOPMENT mode")


def readSourceFile(path):
  """ Reads the local file from the given path relative to the source directory """
  path = os.path.join(config.SOURCE_DIR, path)
  return open(path).read()


#------------------------------------------------------------------------------
# SERVING
#------------------------------------------------------------------------------
@app.route('/')
def index():
  """Returns the optimizer IDE."""

  init_js = []
  init_js.append("<script type='text/javascript'>")
  init_js.append(config.GA_CODE)
  init_js.append("</script>")

  index_html = readSourceFile('index.html')
  index_html = index_html.replace("<!-- PLACEHOLDER -->", "\n".join(init_js))

  response = make_response(index_html)
  return response


@app.route("/<filename>.html")
def loadHtmlFile(filename):
  try:
    return readSourceFile(filename + ".html")
  except Exception, e:
    logging.exception(e)
    return page_not_found(e)


@app.errorhandler(404)
def pageNotFound(e):
  """Return a custom 404 error."""
  return readSourceFile('404.html'), 404


#------------------------------------------------------------------------------
# FEEDBACK
#------------------------------------------------------------------------------
@app.route('/feedback', methods=['POST'])
@json_request
def feedback(name, email, text):
  if len(name) <= 1:
    return error("Please provide a name")

  if len(email) <= 1:
    return error("Please provide an email address")
  
  if len(text) <= 1:
    return error("Please provide a message")
    
  mail.send_mail(sender="online-optimizer feedback <yzwols@gmail.com>",
              to="Yori Zwols <yzwols@gmail.com>",
              subject="Online feedback from " + name,
              body="Feedback from " + name + " <" + email + ">\n" + text)
              
  return ok()


#------------------------------------------------------------------------------
# MODEL STORAGE
#------------------------------------------------------------------------------
@app.route('/load', methods=['POST'])
@json_request
def readModelFile(url):
  """Reads a model from the given url; if the file is too large, an exception is thrown"""
  logging.info("Loading model from %s" % url)
  stream = urllib2.urlopen(url)
  data = stream.read(config.MAX_MODEL_SIZE + 1)
  if len(data) > config.MAX_MODEL_SIZE:
    raise Exception("The given model file is too large (maximum is %d bytes)" % config.MAX_MODEL_SIZE)
  logging.info("Loaded %d bytes" % len(data))
  logging.info(data)
  return data


@app.route('/storage/key', methods=['GET'])
@json_request
def storageKey():
  """Generates a random new storage key"""
  key = ModelStorage.generateKey()
  logging.info("Generated new key: %s" % key)
  return key


@app.route('/storage/read/<key>', methods=['GET'])
@json_request
def storageRead(key):
  """Reads the model code with the given storage key"""
  code = ModelStorage.read(key)
  logging.info("Load model code with key: %s" % key)
  return code


@app.route('/storage/write/<key>', methods=['POST'])
@json_request
def storageWrite(key, code):
  """Reads the model code with the given storage key"""
  code = ModelStorage.write(key, code)
  logging.info("Written model code with key: %s" % key)
  return "OK"


logging.info("Running with Flask {}".format(flask.__version__))
startApp()

