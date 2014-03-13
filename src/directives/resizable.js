var module = angular.module('ui.resizable', []);

/**
 * Directive for components that may change their size depending on the window size.
 */
module.directive('resizable', function ($window) {
  "use strict";
  return function ($scope) {
    $scope.updateWindowSize = function () {
      $scope.windowHeight = $window.innerHeight;
      $scope.windowWidth = $window.innerWidth;
    };

    angular.element($window).bind("resize", function () {
      $scope.updateWindowSize();
      $scope.$apply();
    });

    $scope.updateWindowSize();
  }
});

