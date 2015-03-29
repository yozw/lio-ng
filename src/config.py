import os
import sys


def isProductionServer():
  return os.environ.get('SERVER_SOFTWARE', '').startswith('Google App Engine')


def getBaseDir():
  return os.path.dirname(__file__)


def getSourceDirectory():
  return os.path.join(BASE_DIR, 'application/')


BASE_DIR = getBaseDir()
PRODUCTION = isProductionServer()
SOURCE_DIR = getSourceDirectory()

# Google Analytics code
GA_CODE = """
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-46105838-4', 'online-optimizer.appspot.com');
ga('send', 'pageview');
"""

MAX_MODEL_SIZE = 128 * 1024
MAX_JSON_DATA_SIZE = 128 * 1024

