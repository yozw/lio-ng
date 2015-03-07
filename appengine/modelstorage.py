import random
import string
from google.appengine.ext import db

KEY_LENGTH = 32
KEY_ALPHABET = string.ascii_uppercase + string.digits

class ModelStorage(db.Model):
  code = db.StringProperty()

  @classmethod
  def read(clazz, key):
    if not ModelStorage.isValidKey(key):
      raise ValueError("Invalid key")
    entity = clazz.get_by_key_name(key)
    if not entity:
      raise ValueError("Unknown key")
    return entity.code

  @classmethod
  def write(clazz, key, code):
    if not ModelStorage.isValidKey(key):
      raise ValueError("Invalid key")
    if not clazz.get_by_key_name(key):
      raise ValueError("Unknown key")

    if len(code) > 64 * 1024:
      raise ValueError("Too much code")

    entity = clazz(key_name = key, code = code)
    entity.put()
    return code

  @classmethod
  def isValidKey(clazz, key):
    if len(key) != KEY_LENGTH:
      return False

    for i in range(len(key)):
      if not key[i] in KEY_ALPHABET:
        return False
    return True

  @classmethod
  def generateKey(clazz):
    key = ''.join(random.SystemRandom().choice(KEY_ALPHABET) for _ in range(KEY_LENGTH))
    entity = clazz(key_name = key, code = "code!")
    entity.put()
    return key

