// GMPL table handler for Json output

function JsonTableHandler() {
  this.name = "JSON";
}

// Output table as JSON
JsonTableHandler.prototype.write = function (args, data) {
  var options = {
    format: true
  };

  try {
    options = TableUtil.extendOptions(options, args[3]);
  } catch (e) {
    throw new Error("Could not parse JSON table driver options. " + e);
  }

  var jsonCode;
  if (options.format) {
    jsonCode = JSON.stringify(data, null, 2)
  } else {
    jsonCode = JSON.stringify(data, null, 0)
  }
  postVerbatim(jsonCode);
};
