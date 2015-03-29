"""`appengine_config` gets loaded when starting a new application instance."""
from google.appengine.ext import vendor

# Third-party libraries are stored in "python", vendoring will make
# sure that they are importable by the application.
vendor.add('python')
