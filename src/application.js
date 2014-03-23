var app = angular.module('lio-ng',
    [ 'ui.bootstrap',
      'ui.ace',
      'ui.chart',
      'directives.tabs',
      'directives.resizable',
      'directives.resultgraph',
      'directives.resulttable'
    ]);

app.controller('AppCtrl', function ($scope, $compile, model, jqPlotRenderService, solverService, storageService, messageService, aboutDialog, sensitivityDialog, feedbackDialog) {
  "use strict";

  $scope.examples = [
    {name: 'From the book', url: 'none', subItems: [
      {name: 'Dovetail', url: '/models/book/dovetail.mod'},
      {name: 'Diet problem', url: '/models/book/diet.mod'},
      {name: 'Knapsack problem', url: '/models/book/knapsack.mod'},
      {name: 'Portfolio optimization', url: '/models/book/portfolio.mod'},
      {name: 'Machine scheduling problem', url: '/models/book/scheduling.mod'},
      {name: 'Decentralization problem', url: '/models/book/decentral.mod'}
    ]},
    {name: 'Two-dimensional models', url: 'none', subItems: [
      {name: 'Dovetail', url: '/models/book/dovetail.mod'},
      {name: 'Circle', url: '/models/circle.mod'}
    ]},
    {name: 'Scheduling', url: 'none', subItems: [
      {name: 'Knight\'s tour', url: '/models/winglpk/knights.mod'},
      {name: 'Personnel assignment problem', url: '/models/winglpk/personnel.mod'},
      {name: 'Simple single unit dispatch', url: '/models/glpk/dispatch.mod'}
    ]},
    {name: 'Financial', url: 'none', subItems: [
      {name: 'Portfolio optimization using mean absolute deviation', url: '/models/glpk/PortfolioMAD.mod'}
    ]}
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
          {type: 'graph', graph: jqPlotRenderService.render(graph)}
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

  $scope.loadModel("/models/book/dovetail.mod");
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

