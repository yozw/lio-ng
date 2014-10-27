var app = angular.module('lio-ng',
    [ 'ui.bootstrap',
      'ui.ace',
      'ui.chart',
      'directives.tabs',
      'directives.resizable',
      'directives.resultgraph',
      'directives.resulttable',
      'directives.mathjax',
      'ngSanitize'
    ]);

app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
}]);

app.controller('AppCtrl', function (
    $scope,
    $compile,
    $location,
    model,
    jqPlotRenderService,
    solverService,
    storageService,
    messageService,
    driveService,
    aboutDialog,
    sensitivityDialog,
    feedbackDialog) {
  "use strict";

  $scope.examples = [
    {name: 'Home', url: '/models/default.mod'},
    {name: 'From the book', subItems: [
      {name: 'Dovetail', url: '/models/book/dovetail.mod'},
      {name: 'Diet problem', url: '/models/book/diet.mod'},
      {name: 'Knapsack problem', url: '/models/book/knapsack.mod'},
      {name: 'Portfolio optimization', url: '/models/book/portfolio.mod'},
      {name: 'Machine scheduling problem', url: '/models/book/scheduling.mod'},
      {name: 'Decentralization problem', url: '/models/book/decentral.mod'}
    ]},
    {name: 'Two-dimensional models', subItems: [
      {name: 'Dovetail', url: '/models/book/dovetail.mod'},
      {name: 'Circle', url: '/models/circle.mod'}
    ]},
    {name: 'Scheduling', subItems: [
      {name: 'Knight\'s tour', url: '/models/winglpk/knights.mod'},
      {name: 'Personnel assignment problem', url: '/models/winglpk/personnel.mod'},
      {name: 'Simple single unit dispatch', url: '/models/glpk/dispatch.mod'}
    ]},
    {name: 'Financial', subItems: [
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
    callback.error = function (message) {
      messageService.set(message);
      model.log += "ERROR: " + message + "\n";
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

    messageService.set("Solving model", true);
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
    if (url !== undefined) {
      $location.search('model', url);
    }
  };
  
  $scope.loadModelFromDrive = function () {
    driveService.loadWithPicker(function(code) {
      $scope.model.code = code;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    });
  };

  $scope.$on('$locationChangeSuccess', function(next, current) {
    function callback(code, help) {
      $scope.model.code = code;
      $scope.model.help = help;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    }

    var url = $location.search().model;
    if (url === undefined || url === "") {
      url = "/models/default.mod";
    }

    storageService.readModel(url, callback);
  });
});

app.factory('model', function () {
  return {code: "", log: "", help: "", results: []};
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

