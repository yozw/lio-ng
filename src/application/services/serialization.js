app.service('serializationService', function () {
  "use strict";

  function deserializeModel(data) {
    // This regex matches a javadoc-style comment of the form "/** <comment> */"
    // and any whitespace surrounding it.
    var regex = /^\s*((?:\/\*\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:\/\/.*))\s*/;

    var match = data.match(regex);
    if (match == null) {
      return {doc: "", code: data.trim() + "\n"};
    } else {
      // determine the contents of the /** <contents> */
      var doc = match[1];  // the full comment, without trailing spaces
      var start = 1;
      var end = doc.length - 2;

      // note that these loops are guaranteed to end because of the
      // leading and trailing slashes
      while (doc[start] == '*') {
        start++;
      }
      while (doc[end] == '*') {
        end--;
      }

      if (start < end) {
        doc = doc.substring(start, end + 1);
      } else {
        doc = "";
      }

      var code = data.substring(match[0].length).trim() + "\n";

      return {doc: doc, code: code}
    }
  }

  function serializeModel(model) {
    if (model.doc.trim().length == 0) {
      return model.code.trim() + "\n";
    } else {
      return "/**" + model.doc + "*/\n\n" + model.code.trim() + "\n";
    }
  }

  return {
    deserializeModel: deserializeModel,
    serializeModel: serializeModel
  }
});
