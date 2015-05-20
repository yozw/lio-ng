var module = angular.module('directives.results.verbatim', []);

// TODO: Write unit tests
module.directive('resultsVerbatim', function () {
  "use strict";
  return {
    restrict: "E",
    require: '^ngModel',
    replace: false,
    scope: {
      ngModel: '='
    },
    template: '<div class="output-verbatim">{{ngModel.text}}</div>'
  };
});
