// GMPL table handler for Google Charts output

function GoogleChartsHandler() {
  this.name = "GCHART";
}

GoogleChartsHandler.prototype.write = function (arg, data) {
  var title = arg[2];
  var chartType = arg[3];
  var options = arg[4];

  if (!title) {
    title = "";
  }
  if (!chartType) {
    chartType = "Table";
  }
  if (!options) {
    options = {}
  }

  postOutputObject('google-chart', {
    title: title,
    chartType: chartType,
    options: options,
    data: data
  });
};
