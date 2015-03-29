var module = angular.module('directives.resultgraph', []);

// TODO: Write unit tests
module.directive('resultGraph', function () {
  "use strict";
  return {
    restrict: "E",
    require: '^ngModel',
    replace: false,
    scope: {
      ngModel: '='
    },
    template: '<div ui-chart="ngModel.data" chart-options="ngModel.options"></div>'
  };
});


