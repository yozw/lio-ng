var app = angular.module('lio-ng', ['ui.bootstrap', 'ui.ace', 'ui.tabs']);

app.controller('AppCtrl', function ($scope, model, solverService, storageService) {
  "use strict"
  $scope.examples = [
    {name: 'Dovetail', url: '/lio-ng/models/dovetail.mod'},
    {name: 'Diet problem', url: '/lio-ng/models/diet.mod'},
    {name: 'Knapsack problem', url: '/lio-ng/models/knapsack.mod'},
    {name: 'Portfolio optimization', url: '/lio-ng/models/portfolio.mod'},
    {name: 'Machine scheduling problem', url: '/lio-ng/models/scheduling.mod'},
    {name: 'Decentralization problem', url: '/lio-ng/models/decentral.mod'}
  ];

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
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    }

    storageService.readModel(url, callback);
  }

  $scope.loadModel("/lio-ng/models/dovetail.mod");
});

app.factory('model', function () {
  return {code: "", log: ""};
});

/**
 * Directive for components that may change their size depending on the window size.
 */
app.directive('resizable', function ($window) {
  "use strict"
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
  "use strict"
  $scope.statusMessage = statusMessage;
});

