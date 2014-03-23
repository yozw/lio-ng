"""Lio-ng backend"""

import os
import json
from google.appengine.api import mail
from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def index():
  """Return a friendly HTTP greeting."""
  path = os.path.join(os.path.split(__file__)[0], 'static/src/index.html')
  return open(path).read()

def error(message):
  return json.dumps({'error': message})
  
def ok():
  return json.dumps({'message': 'OK'})

@app.route('/feedback', methods=['POST'])
def feedback():
  if request.method != 'POST':
    return "Invalid"
    
  if len(request.data) > 1024 * 1024:
    return "Too much data"
   
  data = json.loads(request.data)
  name = data['name']
  email = data['email']
  text = data['text']

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

@app.errorhandler(404)
def page_not_found(e):
  """Return a custom 404 error."""
  return 'Sorry, nothing at this URL.', 404


@app.errorhandler(500)
def page_not_found(e):
  """Return a custom 500 error."""
  return 'Sorry, unexpected error: {}'.format(e), 500
