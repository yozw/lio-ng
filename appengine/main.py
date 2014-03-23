"""Thin lio-ng backend"""

# Import the Flask Framework
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
  """Return a friendly HTTP greeting."""
  return 'Hello World!'


@app.errorhandler(404)
def page_not_found(e):
  """Return a custom 404 error."""
  return 'Sorry, nothing at this URL.', 404


@app.errorhandler(500)
def page_not_found(e):
  """Return a custom 500 error."""
  return 'Sorry, unexpected error: {}'.format(e), 500
