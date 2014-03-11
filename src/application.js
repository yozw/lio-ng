var app = angular.module('lio-ng', ['ui.bootstrap', 'ui.ace', 'ui.tabs']);

app.controller('AppCtrl', function ($scope, model, solverService, storageService) {
  $scope.model = model;
  $scope.solveModel = function () {
    model.log = "";

    function logCallback(message) {
      model.log += message + "\n";
      $scope.$apply();
    }

    solverService.solve($scope.model, logCallback);
  }

  $scope.loadModel = function (url) {
    function callback(code) {
      $scope.model.code = code;
      //$scope.$apply();
    }

    storageService.readModel(url, callback);
  }

  $scope.loadModel("/lio-ng/models/dovetail.mod");
});

app.factory('model', function () {
  return {code: "Type your model code here", log: ""};
});

/**
 * Directive for components that may change their size depending on the window size.
 */
app.directive('resizable', function ($window) {
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

app.controller('ButterBarCtrl', function ($scope, statusMessage) {
  $scope.statusMessage = statusMessage;
});

