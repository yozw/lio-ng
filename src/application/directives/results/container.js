var module = angular.module('directives.results.container', []);

// TODO: Write unit tests
module.directive('resultsContainer', function () {
  "use strict";

  return {
    restrict: "E",
    replace: true,
    scope: {
      entries: '=',
      header: '@'
    },
    templateUrl: '/application/directives/results/container.html'
  };
});

