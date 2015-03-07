"""Lio-ng backend"""

import logging
import os
import urllib2
import string
import random

from flask import Flask, request, make_response
from google.appengine.api import mail
from json_lib import ok, error, json_request
from time import gmtime, strftime
from modelstorage import ModelStorage

import config

app = Flask(__name__)

GA_CODE = """
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-46105838-4', 'online-optimizer.appspot.com');
ga('send', 'pageview');
"""


""" Reads the local file from the given path relative to this script """
def read_file(path):
  path = os.path.join(os.path.split(__file__)[0], 'static/src/', path)
  return open(path).read()


@app.route('/')
def index():
  """Returns the optimizer IDE."""

  init_js = []
  init_js.append("<script type='text/javascript'>")
  init_js.append(GA_CODE)
  init_js.append("</script>")

  index_html = read_file('index.html')
  index_html = index_html.replace("<!-- PLACEHOLDER -->", "\n".join(init_js))

  response = make_response(index_html)
  return response


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


@app.route("/<filename>.html")
def load_html_file(filename):
  try:
    return read_file(filename + ".html")
  except Exception, e:
    logging.exception(e)
    return page_not_found(e)


@app.errorhandler(404)
def page_not_found(e):
  """Return a custom 404 error."""
  return read_file('404.html'), 404


#------------------------------------------------------------------------------
# STORAGE
#------------------------------------------------------------------------------
@app.route('/load', methods=['POST'])
@json_request
def read_model_file(url):
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
def storage_key():
  """Generates a random new storage key"""
  key = ModelStorage.generateKey()
  logging.info("Generated new key: %s" % key)
  return key


@app.route('/storage/read/<key>', methods=['GET'])
@json_request
def storage_read(key):
  """Reads the model code with the given storage key"""
  code = ModelStorage.read(key)
  logging.info("Load model code with key: %s" % key)
  return code


@app.route('/storage/write/<key>', methods=['POST'])
@json_request
def storage_write(key, code):
  """Reads the model code with the given storage key"""
  code = ModelStorage.write(key, code)
  logging.info("Written model code with key: %s" % key)
  return "OK"
