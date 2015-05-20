// GMPL table handler for Json output

function JsonTableHandler() {
  this.name = "JSON";
}

// Output table as JSON
JsonTableHandler.prototype.write = function (args, data) {
  var options = {
    format: true
  };

  if (args.length > 3) {
    var parsedOptions = {};
    try {
      var passedArgs = args[3].trim();
      if (passedArgs.length > 0) {
        parsedOptions = JSON.parse(passedArgs)
      }
    } catch (e) {
      throw new Error("Could not parse JSON table driver options. " + e);
    }
    options = extend(options, parsedOptions);
  }

  var jsonCode;
  if (options.format) {
    jsonCode = JSON.stringify(data, null, 2)
  } else {
    jsonCode = JSON.stringify(data, null, 0)
  }
  postVerbatim(jsonCode);
};
