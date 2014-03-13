var app = angular.module('lio-ng', ['ui.bootstrap', 'ui.ace', 'ui.tabs', 'ui.resizable']);

app.controller('AppCtrl', function ($scope, model, solverService, storageService) {
  "use strict";
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

    var callback = Object();
    callback.log = function (message) {
      model.log += message + "\n";
      $scope.$apply();
    };

    solverService.solve(model.code, callback);
  };

  $scope.loadModel = function (url) {
    function callback(code) {
      $scope.model.code = code;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    }

    storageService.readModel(url, callback);
  };

  $scope.loadModel("/lio-ng/models/dovetail.mod");
});

app.factory('model', function () {
  return {code: "", log: ""};
});

app.controller('ButterBarCtrl', function ($scope, messageService) {
  "use strict";
  $scope.isVisible = false;
  $scope.status = messageService.status;
  $scope.clear = messageService.clear;
  $scope.$watch('status.message', function(value) {
    $scope.isVisible = value.length > 0;
  });
});

