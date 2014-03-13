import re
import traceback
import sys
from copy import copy

class Scope(object):
  echo = True

def leave_environment(env, scope, line):
  if env == "iftex" or env == "tex":
    return ""
  return line
  
def enter_environment(env, scope, line):
  if env == "ifnottex":
    scope.echo = False
  elif env == "tex":
    return ""
  elif env == "iftex":
    return ""
  return line
  
  
def process_math(text):
  def process(expression):
    return expression.replace("@", '\\').replace("{", "@{").replace("}", "@}")
  text = re.sub(r"\$\$([^\$]+)\$\$", lambda match: "$$" + process(match.group(1)) + "$$", text)
  text = re.sub(r"([^\$])\$([^\$]+)\$([^\$])", lambda match: match.group(1) + "$" + process(match.group(2)) + "$" + match.group(3), text)
  return text

def replace_math(text):
  index = -1
  while True:
    index = text.find("@math{", index + 1)
    if index == -1:
      break
    depth = 1
    for i in range(index+6, len(text)):
      if text[i] == '{': depth += 1
      if text[i] == '}': depth -= 1
      if depth == 0: break
    if depth != 0:
      raise Exception("Missing closing brackets")
    end_index = i
    start = "$"
    end = "$ " if text[end_index] == '$' else "$"
    expression = text[index+6:end_index]
    text = text[0:index] + "$" + expression + "$ " + text[end_index+1:]  
  return text
    
ENVIRONMENTS = set()

# READ FILE
lines = open('gmpl.texi').readlines()

# DETECT ENVIRONMENTS
for line in lines:
  stripped = line.strip()
  if stripped.startswith('@end '):
    ENVIRONMENTS.add(stripped[5:].strip())

sys.stderr.write("Detected the following environments: " + ", ".join(sorted(ENVIRONMENTS)) + ".\n")
stack = []
scope_stack = [Scope()]

# PARSE FILE
output = []

for (line_no, line) in enumerate(lines):
  try:
    stripped = line.strip()
      
    if stripped.startswith('@') and not stripped.startswith('@end '):
      cmd = stripped[1:].split(" ")[0]
      if cmd in ENVIRONMENTS:
        stack.append(cmd)
        scope_stack.append(copy(scope_stack[-1]))
        line = enter_environment(cmd, scope_stack[-1], line)
      elif cmd == 'sp':
        line = ""

    scope = scope_stack[-1]
    echo = scope.echo

    if stripped.startswith('@end '):
      endenv = stripped[5:]
      if len(stack) == 0 or endenv != stack[-1]:
        raise Exception('Unexpected @end ' + endenv)
      line = leave_environment(endenv, scope_stack[-1], line)
      del stack[-1]
      del scope_stack[-1]

    if scope.echo:
      output.append(line)

  except Exception, e:
    traceback.print_exc()
    raise Exception("Error at line %d: %s" % (line_no + 1, e.message), e) 
    

text = "".join(output)

text = replace_math(text)
text = process_math(text)
text = text.replace("@dots{}", "$\dots$")
text = text.replace("@dots", "$\dots$")
print text


