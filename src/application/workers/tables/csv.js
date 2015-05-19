// GMPL table handler for CSV output

function CsvTableHandler() {
  this.name = "CSV";
}

CsvTableHandler.prototype.write = function (args, data) {
  var options = {
    delimiter: ","
  };

  if (args.length > 2) {
    var parsedOptions;
    try {
      parsedOptions = JSON.parse(args[2])
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
    postOutput(line.join(options.delimiter));
  }
};
