var module = angular.module('directives.results.google_chart', ['googlechart']);

// TODO: Write unit tests
module.directive('resultsGoogleChart', function () {
  "use strict";
  return {
    restrict: "E",
    require: '^ngModel',
    replace: false,
    scope: {
      ngModel: '='
    },
    template: '<h4>{{ngModel.title}}</h4>' +
        '<div google-chart chart="ngModel"></div>'
  };
});
