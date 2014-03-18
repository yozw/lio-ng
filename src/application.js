var app = angular.module('lio-ng',
    [ 'ui.bootstrap',
      'ui.ace',
      'ui.chart',
      'directives.tabs',
      'directives.resizable',
      'directives.resulttable'
    ]);

app.controller('AppCtrl', function ($scope, $compile, model, solverService, storageService, messageService, aboutDialog, sensitivityDialog, feedbackDialog) {
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
    model.results = [];

    var callback = Object();
    callback.log = function (message) {
      model.log += message + "\n";
      $scope.$apply();
    };
    callback.finished = function (message) {
      messageService.set("Solving finished");
    };
    callback.emitTable = function (table) {
      $scope.model.results.push(
          {type: 'table', table: table}
      );
      $scope.$apply();
    };
    callback.emitGraph = function (graph) {
      $scope.model.results.push(
          {type: 'graph', graph: graph}
      );
      $scope.$apply();
    };

    messageService.set("Solving model");
    solverService.solve(model.code, callback);
  };

  $scope.showAbout = function () {
    aboutDialog.open();
  };

  $scope.showFeedback = function () {
    feedbackDialog.open();
  };

  $scope.showSensitivityDialog = function () {
    sensitivityDialog.open();
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
  return {code: "", log: "", results: []};
});

app.controller('ButterBarCtrl', function ($scope, messageService) {
  "use strict";
  $scope.isVisible = false;
  $scope.status = messageService.status;
  $scope.clear = messageService.clear;
  $scope.$watch('status.message', function (value) {
    $scope.isVisible = value.length > 0;
  });
});

