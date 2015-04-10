var module = angular.module('directives.results.graph', []);

// TODO: Write unit tests
module.directive('resultsGraph', function () {
  "use strict";
  return {
    restrict: "E",
    require: '^ngModel',
    replace: false,
    scope: {
      ngModel: '='
    },
    template: '<div style="width:{{ngModel.options.width}}; height:{{ngModel.options.height}};" '
        + ' ui-chart="ngModel.data" chart-options="ngModel.options"></div>'
  };
});


