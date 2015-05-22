// GMPL table handler for Google Charts output

function GoogleChartsHandler() {
  this.name = "GCHART";
}

GoogleChartsHandler.prototype.write = function (args, data) {
  var chartData = {
    title: args[2] || "",
    type: args[3] || "Table",
    options: {},
    data: data
  };

  try {
    chartData.options = TableUtil.extendOptions(chartData.options, args[4]);
  } catch (e) {
    throw new Error("Could not parse GCHART table driver options. " + e);
  }

  postGoogleChart(chartData);
};
