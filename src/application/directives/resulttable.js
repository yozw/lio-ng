var module = angular.module('directives.resulttable', []);

// TODO: Write unit tests
module.directive('resultTable', function () {
  "use strict";
  return {
    restrict: "E",
    require: '^ngModel',
    replace: true,
    scope: {
      ngModel: '='
    },
    templateUrl: '/application/directives/resulttable.html',
    link: function(scope) {
      scope.formatValue = function (value) {
        if (typeof value === 'number') {
          return parseFloat(value.toFixed(7));
        } else {
          return value;
        }
      };
    }
  };
});


