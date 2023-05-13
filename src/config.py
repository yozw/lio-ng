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
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JE7MLXZRRF"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-JE7MLXZRRF');
</script>
"""

MAX_MODEL_SIZE = 128 * 1024
MAX_JSON_DATA_SIZE = 128 * 1024

