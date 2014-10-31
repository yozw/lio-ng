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
    model,
    jqPlotRenderService,
    solverService,
    storageService,
    messageService,
    googlePickerService,
    aboutDialog,
    sensitivityDialog,
    feedbackDialog) {
  "use strict";

  window.onbeforeunload = function() {
    return 'You are about to leave the online linear optimization solver. If you leave without saving, your changes will be lost.';
  };

  storageService.onModelLoaded(function (code, help) {
    $scope.model.code = code;
    $scope.model.help = help;
    if (!$scope.$$phase) {
      $scope.$apply();
    }
  });

  $scope.examples = [
    {name: 'Home', url: 'model://default.mod'},
    {name: 'From the book', subItems: [
      {name: 'Dovetail', url: 'model://book/dovetail.mod'},
      {name: 'Diet problem', url: 'model://book/diet.mod'},
      {name: 'Knapsack problem', url: 'model://book/knapsack.mod'},
      {name: 'Portfolio optimization', url: 'model://book/portfolio.mod'},
      {name: 'Machine scheduling problem', url: 'model://book/scheduling.mod'},
      {name: 'Decentralization problem', url: 'model://book/decentral.mod'}
    ]},
    {name: 'Two-dimensional models', subItems: [
      {name: 'Dovetail', url: 'model://book/dovetail.mod'},
      {name: 'Circle', url: 'model://circle.mod'}
    ]},
    {name: 'Scheduling', subItems: [
      {name: 'Knight\'s tour', url: 'model://winglpk/knights.mod'},
      {name: 'Personnel assignment problem', url: 'model://winglpk/personnel.mod'},
      {name: 'Simple single unit dispatch', url: 'model://glpk/dispatch.mod'}
    ]},
    {name: 'Financial', subItems: [
      {name: 'Portfolio optimization using mean absolute deviation', url: 'model://glpk/PortfolioMAD.mod'}
    ]}
  ];

  $scope.model = model;
  $scope.isComputing = false;

  $scope.solveModel = function () {
    if ($scope.isComputing) {
      solverService.terminateWorker();
      return;
    }
    model.log = "";
    model.results = [];

    var callback = Object();
    callback.log = function (message) {
      model.log += message + "\n";
      $scope.$apply();
    };
    callback.error = function (message) {
      $scope.isComputing = false;
      messageService.set(message);
      model.log += "ERROR: " + message + "\n";
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };
    callback.success = function (message) {
      $scope.isComputing = false;
      messageService.set("Solving finished. " + message);
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
    $scope.isComputing = true;
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
      storageService.readModel(url);
    }
  };

  $scope.loadModelFromDrive = function () {
    googlePickerService.pickDriveModel(function (fileId) {
      storageService.readModel('gdrive://' + fileId);
    });
  };
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

app.controller('ResultsTabCtrl', function ($scope, uiChartRefreshService) {
  "use strict";
  $scope.refresh = function() {
    console.log('Refeshing charts');
    uiChartRefreshService.refreshAll();
  };
});

app.controller('EditorTabCtrl', function ($scope) {
  "use strict";
  $scope.focusOnEditor = function() {
    var aceEditorElement = angular.element('textarea.ace_text-input');
    aceEditorElement.focus();
  };
});

