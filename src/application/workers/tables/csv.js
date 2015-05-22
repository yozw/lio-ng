// GMPL table handler for CSV output

function CsvTableHandler() {
  this.name = "CSV";
}

CsvTableHandler.prototype.write = function (args, data) {
  var options = {
    delimiter: ","
  };

  try {
    options = TableUtil.extendOptions(options, args[3]);
  } catch (e) {
    throw new Error("Could not parse CSV table driver options. " + e);
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
