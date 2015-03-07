import logging
import inspect
import json
import sys

from flask import request


def error(message):
  return json.dumps({'error': message})


def ok():
  return json.dumps({'message': 'OK'})


def json_request(func, methods = []):
  def wrapper(**kwargs):
    try:
      # Check request data
      if request.method == 'POST':
        if len(request.data) > 64 * 1024:
          raise ValueError("POSTed too much data")

        # Read request data
        data = json.loads(request.data)
      else:
        data = {}

      # Populate arguments for wrapped function
      wrapped_kwargs = dict()
      for arg in inspect.getargspec(func)[0]:
        if arg in kwargs:
          wrapped_kwargs[arg] = kwargs[arg]
        else:
          wrapped_kwargs[arg] = data[arg]

      # Call wrapped function
      return func(**wrapped_kwargs)
    except Exception as e:
      logging.exception(e)
      return error("Internal error")

  wrapped_function = wrapper
  wrapped_function.__name__ = func.__name__
  return wrapped_function
