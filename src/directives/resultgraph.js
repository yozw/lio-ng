var module = angular.module('directives.resultgraph', []);

module.directive('resultGraph', function () {
  "use strict";
  return {
    restrict: "E",
    require: '^ngModel',
    replace: false,
    scope: {
      ngModel: '='
    },
    templateUrl: 'directives/resultgraph.html'
  };
});


