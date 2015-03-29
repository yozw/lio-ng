import re
import traceback
import sys
from copy import copy

class Scope(object):
  echo = True
  comment = ""

""" Callback for when the parser finds a tag that has a matching @end <env> command """
def enter_environment(env, scope, line):
  if env == "ifnottex":
    scope.echo = False
  elif env == "tex":
    return ""
  elif env == "iftex":
    return ""
  return line  

""" Callback for when the parser finds an @end <env> command """
def leave_environment(env, scope, line):
  if env == "iftex" or env == "tex":
    return ""
  return line
  
""" Determines which @ commands are environmnets (i.e. have a matching @end tag) """
def get_environments(lines):    
  env = set()
  for line in lines:
    stripped = line.strip()
    if stripped.startswith('@end '):
      env.add(stripped[5:].strip())
  return env

""" Cleans up the file by removing all code in the @ifnottex environment, and removing all @iftex
    opening and closing commands. Also removes @sp. """
def cleanup_file(lines):
  ENVIRONMENTS = get_environments(lines)

  # PARSE FILE
  stack = []
  scope_stack = [Scope()]

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
        elif cmd == 'contents':
          line = "@contents\n@ifnottex\n@node Top\n@top GNU MathProg Language Reference\n@end ifnottex"

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
  return output

""" Takes a texinfo expression inside $$ or $ signs and turns it into Mathjax form that can be 
    embedded in texinfo """
def expression_to_mathjax(expression, delimiter):
  if "\\eqno" in expression:
    expression = "\\begin{equation}" + re.sub(r"\\eqno\(([0-9]+)\)", r"\\tag{\1}", expression) + "\end{equation}"
  return delimiter + expression.replace("@", '\\').replace("{", "@{").replace("}", "@}") + delimiter

""" Recursively simplify anything of the form $expr1$, $expr2$ to $expr1, expr$ """
def combine_math(text):
  def replace_fn(match):
    return match.group(1) + "$" + match.group(2) + match.group(3) + match.group(4) + "$" + match.group(5)
  
  last_len = 0
  while len(text) != last_len:
    last_len = len(text)
    text = re.sub("([^\$]|^)\$([^\$]+)\$([ ,]+)\$([^\$]+)\$([^\$]|$)", replace_fn, text)
  return text
  
""" Finds all $$ and $ environment and applies expression_to_mathjax to their contents """
def to_mathjax(text):
  text = re.sub(r"\$\$([^\$]+)\$\$", lambda match: expression_to_mathjax(match.group(1), "$$"), text)
  text = re.sub(r"([^\$]|^)\$([^\$]+)\$([^\$]|$)", lambda match: match.group(1) + expression_to_mathjax(match.group(2), "$") + match.group(3), text)
  text = text.replace("@dots{}", "$\dots$")
  text = text.replace("@dots", "$\dots$")
  return combine_math(text)

""" Replaces all @math{...} environments by $...$ """
def replace_math_env(text):
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
    remainder = text[end_index+1:]
    start = "$"
    if remainder.startswith("@math"):
      end = "$ "
    else:
      end = "$"
    expression = text[index+6:end_index]
    text = text[0:index] + start + expression + end + remainder
  return text

""" Goes through all mathematical expressions in the file and converts them to a Mathjax suitable
    form """
def process_math(lines):
  text = "".join(lines)
  text = replace_math_env(text)
  text = to_mathjax(text)
  return text

if __name__ == "__main__":
  lines = open('gmpl.texi').readlines()
  lines = cleanup_file(lines)
  
  sys.stdout.write(process_math(lines))
    

