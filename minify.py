import os
import re

INPUTDIR="./"
OUTPUTDIR="appengine/static/"
MINIFY_SRC=True
USE_UGLIFY=True

def ensure_dir(f):
    d = os.path.dirname(f)
    if not os.path.exists(d):
        os.makedirs(d)
        
def relative_path(path, base_dir):
  if path.startswith('/tmp/'):
    return path
  while path.startswith('/'):
    path = path[1:]
  return os.path.join(base_dir, path)

def input_path(path):
  return relative_path(path, INPUTDIR)

def output_path(path):
  return relative_path(path, OUTPUTDIR)

def minify(infile, outfile):
  print "Minifying " + infile + " to " + outfile
  ensure_dir(outfile)
  if USE_UGLIFY:
    os.system('uglifyjs %s > %s' % (infile, outfile))
  else:
    os.system('java -jar yuicompressor-2.4.8.jar --line-break 100 --nomunge --type js %s > %s' % (infile, outfile))

def cat(files, outfile):
  print "Concatenating " + str(len(files)) + " files to " + outfile
  ensure_dir(outfile)
  jstemp = open(outfile, 'w')
  for js_file in files:
    jstemp.write(open(js_file).read())
    jstemp.write('\n;\n')
  jstemp.close()

def generate_minified(outfile, sources):
  tempfile1 = "/tmp/minify.js"
  tempfile2 = "/tmp/minify.min.js"

  for i in range(len(sources)):
    if sources[i].startswith("/lib/"):
      sources[i] = sources[i].replace(".js", ".min.js")

  if not MINIFY_SRC:
    minify_sources = [input_path(path) for path in sources if path.startswith("/src/")]
    cat(minify_sources, tempfile1)
    minify(tempfile1, tempfile2)

    cat_sources = [input_path(path) for path in sources if not path.startswith("/src/")]      
    cat_sources += [tempfile2]
    cat(cat_sources, outfile)
  else:
    minify_sources = [input_path(path) for path in sources]
    cat(minify_sources, tempfile1)
    minify(tempfile1, outfile)
  

def minify_html(html_path, js_path):
  sources = []
  
  def replacer(match):
    type = match.group(1)
    src = match.group(2)
    if len(sources) == 0:
      result = '<script type="text/javascript" src="%s"></script>' % js_path
    else:
      result = ''
    
    sources.append(src)
    return result

  input_filename = input_path(html_path)
  output_filename = output_path(html_path)

  print "Minifying " + input_filename + " to " + output_filename
  html = open(input_filename)
  ensure_dir(output_filename)
  out = open(output_filename, 'w')
  for line in html.readlines():
    newline = re.sub('<script type="([^"]*)" src="([^"]*)"></script>', replacer, line)
    if len(newline.strip()) != 0:
      out.write(newline)
  out.close()
  html.close()

  generate_minified(output_path(js_path), sources)

def minify_worker(worker_path):
  temp_filename = '/tmp/worker.js'
  sources = [temp_filename]
  
  def replacer(match):
    src = match.group(1)
    if src.startswith("/src/"):
      sources.append(src)
      return ""
    elif src.startswith("/lib/"):
      return "importScripts('" + src.replace(".js", ".min.js") + "');"
    else:
      return match.group(0)

  input_filename = input_path(worker_path)
  output_filename = output_path(worker_path)

  print "Minifying " + input_filename + " to " + output_filename
  worker = open(input_filename)
  ensure_dir(temp_filename)
  out = open(temp_filename, 'w')
  for line in worker.readlines():
    out.write(re.sub(r"importScripts\('([^']*)'\);", replacer, line))
  worker.close()
  out.close()
  
  generate_minified(output_path(worker_path), sources)


  
minify_html('/src/index.html', '/src/index.js')
minify_worker('/src/workers/solver.js')


