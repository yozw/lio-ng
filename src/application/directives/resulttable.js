var module = angular.module('directives.resulttable', []);

// TODO: Write unit tests
module.directive('resultTable', function () {
  "use strict";

  function formatNumber(value) {
    if (value > 1e308) {
      return "Inf";
    } else if (value < -1e308) {
      return "-Inf";
    } else {
      return parseFloat(value.toFixed(7));
    }
  }

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
          return formatNumber(value);
        } else if (value === null) {
          return "";
        } else {
          return value;
        }
      };
    }
  };
});


