// GMPL table handler for Google Charts output

function GoogleChartsHandler() {
  this.name = "GCHART";
}

GoogleChartsHandler.prototype.write = function (arg, data) {
  var title = arg[2];
  var chartType = arg[3];
  var options;

  try {
    if (arg[4] && arg[4].length > 0) {
      options = eval("(" + arg[4] + ")");
    } else {
      options = {};
    }
  } catch (e) {
    throw new Error("Could not parse options: " + e);
  }

  if (!title) {
    title = "";
  }
  if (!chartType) {
    chartType = "Table";
  }
  if (!options) {
    options = {}
  }

  postGoogleChart({
    title: title,
    type: chartType,
    options: options,
    data: data
  });
};
