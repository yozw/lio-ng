import inspect
import json
import sys
import traceback

from flask import request

def error(message):
  return json.dumps({'error': message})

def ok():
  return json.dumps({'message': 'OK'})

def json_request(func):
  def wrapper():
    if request.method != 'POST':
      print "Only POST requests are supported"
      return error("Invalid request")

    if len(request.data) > 64 * 1024:
      print "POSTed too much data"
      return error("Invalid request")

    try:
      data = json.loads(request.data)

      kwargs = dict()
      for arg in inspect.getargspec(func)[0]:
        kwargs[arg] = data[arg]

      return func(**kwargs)
    except Exception as e:
      print e.message
      traceback.print_exc(file=sys.stdout)
      return error("Internal error")

  wrapped_function = wrapper
  wrapped_function.__name__ = func.__name__
  return wrapped_function

