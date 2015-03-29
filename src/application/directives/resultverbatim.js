var module = angular.module('directives.resultverbatim', []);

// TODO: Write unit tests
module.directive('resultVerbatim', function () {
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


