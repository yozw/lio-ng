// GMPL table handler for Google Charts output

function GoogleChartsHandler() {
  this.name = "GCHART";
}

GoogleChartsHandler.prototype.write = function (arg, data) {
  var title = arg[2];
  var chartType = (arg.length > 3) ? arg[3] : 'Table';
  var options = (arg.length > 4) ? arg[4] : {};

  postOutput("Insert Google Chart here (title = " + title + ")");
};
