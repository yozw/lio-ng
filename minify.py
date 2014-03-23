import os
import re

def minify_html(filename, minified_html, minified_js, minified_js_url):
  sources = []
  
  def replacer(match):
    type = match.group(1)
    src = match.group(2)
    if src.startswith("/src/"): 
      sources.append(src.replace('/src/', 'src/'))
      if len(sources) == 1:      
        return '<script type="%s" src="%s"></script>' % (type, minified_js_url)
    else:
      src = src.replace(".js", ".min.js")
      return '<script type="%s" src="%s"></script>' % (type, src)
    return ""
 
  html = open(filename)
  out = open(minified_html, 'w')
  
  for line in html.readlines():
    out.write(re.sub('<script type="([^"]*)" src="([^"]*)"></script>', replacer, line))
    
  out.close()

  jstemp = open("/tmp/minify.js", 'w')
  for js_file in sources:
    jstemp.write(open(js_file).read())
    jstemp.write('\n;\n')
  jstemp.close()
  
  os.system('java -jar yuicompressor-2.4.8.jar --nomunge --type js /tmp/minify.js > ' + minified_js)

  
minify_html('src/index.html', 'appengine/static/src/index.html', 'appengine/static/src/application.min.js', '/src/application.min.js')


