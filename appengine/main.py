"""Lio-ng backend"""

import os
import json
import urllib2
from google.appengine.api import mail
from flask import Flask, request

app = Flask(__name__)

GA_CODE = """<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-46105838-4', 'online-optimizer.appspot.com');
ga('send', 'pageview');
</script>"""

MAX_MODEL_SIZE = 8192

def read_model_file(url):
  """Reads a model from the give url; if the file is too large, an exception is thrown"""
  stream = urllib2.urlopen(url)
  data = stream.read(MAX_MODEL_SIZE + 1)
  if len(data) > MAX_MODEL_SIZE:
    raise Exception("The given model file is too large (maximum is %d bytes)" % MAX_MODEL_SIZE )
  return data
  
def escape_js(model):
  return model.replace('\\', '\\\\').replace('\n', '\\n').replace('"', '\\"')

@app.route('/')
def index():
  """Returns the optimizer IDE."""
  path = os.path.join(os.path.split(__file__)[0], 'static/src/index.html')
  
  init_js = []

  if 'url' in request.args:
    model = read_model_file(request.args['url'])
    init_js.append("<script type='text/javascript'>")
    init_js.append('INITIAL_MODEL = "' + escape_js(model) + '";')
    init_js.append("</script>")

  init_js.append(GA_CODE)

  index_html = open(path).read()
  index_html = index_html.replace("<!-- PLACEHOLDER -->", "\n".join(init_js))
  return index_html
  

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
  path = os.path.join(os.path.split(__file__)[0], 'static/src/404.html')
  return open(path).read(), 404

