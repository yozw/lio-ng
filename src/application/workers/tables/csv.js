// GMPL table handler for CSV output

function CsvTableHandler() {
  this.name = "CSV";
}

CsvTableHandler.prototype.write = function (args, data) {
  var options = {
    delimiter: ","
  };

  if (args.length > 3) {
    var parsedOptions;
    try {
      var passedArgs = args[3].trim();
      if (passedArgs.length > 0) {
        parsedOptions = JSON.parse(passedArgs)
      }
    } catch (e) {
      throw new Error("Could not parse CSV table driver options. " + e);
    }
    options = extend(options, parsedOptions);
  }

  for (var r = 0; r < data.length; ++r) {
    var line = [];
    var row = data[r];
    for (var c = 0; c < row.length; ++c) {
      line.push(row[c]);
    }
    postVerbatim(line.join(options.delimiter));
  }
};
