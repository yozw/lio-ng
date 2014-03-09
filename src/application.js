var app = angular.module('lio-ng', ['ui.bootstrap', 'ui.ace', 'ui.tabs']);

app.directive('resizable', function($window) {
  return function($scope) {
    var w = angular.element($window);

    $scope.updateWindowSize = function() {
      console.log("Resize");
      console.log($window.innerWidth);
      $scope.windowHeight = $window.innerHeight;
      $scope.windowWidth  = $window.innerWidth;
    };

    angular.element($window).bind("resize", function() {
      $scope.updateWindowSize();
      $scope.$apply();
    });

    $scope.updateWindowSize();
  }
});

app.controller('AppCtrl', ['$scope', function ($scope) {
}]);

app.controller('EditorCtrl', ['$scope', function ($scope, element) {

}]);
