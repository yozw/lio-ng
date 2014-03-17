var module = angular.module('directives.resulttable', []);

module.directive('resultTable', function () {
  "use strict";
  return {
    restrict: "E",
    require: '^ngModel',
    replace: true,
    scope: {
      ngModel: '='
    },
    templateUrl: 'directives/resulttable.html'
  };
});


