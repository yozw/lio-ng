var app = angular.module('lio-ng',
    [ 'ui.bootstrap',
      'ui.ace',
      'ui.chart',
      'ui.grid',
      'directives.tabs',
      'directives.resizable',
      'directives.results.container',
      'directives.results.google_chart',
      'directives.results.graph',
      'directives.results.table',
      'directives.results.verbatim',
      'directives.mathjax',
      'ngSanitize',
      'ngCookies'
    ]);

app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
}]);

app.controller('AppCtrl', function (
    $rootScope,
    $scope,
    $compile,
    $cookies,
    model,
    examples,
    jqPlotRenderService,
    solverService,
    storageService,
    messageService,
    uiChartRefreshService,
    googlePickerService,
    aboutDialog,
    exportDialog,
    sensitivityDialog,
    feedbackDialog,
    welcomeDialog,
    quickStartDialog,
    autosaveService) {
  "use strict";

  // Bind autosave service to onBeforeUnload event
  window.onbeforeunload = autosaveService.onBeforeUnload;

  // Bind storage service callback
  storageService.onModelLoaded(function (model) {
    $scope.model.code = model.code;
    $scope.model.doc = model.doc;
    if (!$scope.$$phase) {
      $scope.$apply();
    }
  });

  function pushResult(target, item) {
    if (!$scope.model.results.hasOwnProperty(target)) {
      console.error("Unknown target: " + target);
    }
    $scope.model.results[target].push(item);
  }

  function emitOutput(target, type, data) {
    switch (type) {
      case "verbatim":
        pushResult(target, {type: 'verbatim', text: data});
        break;
      case "table":
        pushResult(target, {type: 'table', table: data});
        break;
      case "google-chart":
        pushResult(target, {type: 'google-chart', data: data});
        return;
      case "graph":
        pushResult(target, {type: 'graph', graph: jqPlotRenderService.render(data)});
        return;
      default:
        console.error("Unknown output type: " + type);
    }
    $scope.$apply();
  }

  // Bind solver service callback
  solverService.setCallback({
    start: function() {
      $scope.clearResults();
      $scope.isComputing = true;
    },
    log: function (message) {
      model.log += message + "\n";
      $scope.$apply();
    },
    error: function (message) {
      $scope.isComputing = false;
      messageService.set(message);
      model.log += "ERROR: " + message + "\n";
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    },
    success: function (message) {
      $scope.isComputing = false;
      messageService.set("Solving finished. " + message);
    },
    output: emitOutput
  });

  $scope.clearResults = function() {
    model.log = "";
    model.results = {};
    model.results.overview = [];
    model.results.output = [];
    model.results.primal = [];
    model.results.dual = [];
  };

  // Initialize scope functions
  $scope.solveModel = function () {
    if ($scope.isComputing) {
      solverService.terminateWorker();
      return;
    }
    messageService.set("Solving model");
    solverService.solve(model.code);
  };

  $scope.showAbout = function () {
    aboutDialog.open();
  };

  $scope.showQuickStart = function() {
    quickStartDialog.open($scope);
  };

  $scope.showFeedback = function () {
    feedbackDialog.open();
  };

  $scope.showWelcome = function() {
    welcomeDialog.open($scope);
  };

  $scope.showSensitivityDialog = function () {
    sensitivityDialog.open($scope.model.code, $scope.selectionRange);
  };

  $scope.onChangeSelection = function(e, selection) {
    $scope.selectionRange = selection.getRange();
  };

  $scope.loadModel = function (url) {
    if (url) {
      storageService.readModel(url);
      $scope.clearResults();
    }
  };

  $scope.newModel = function () {
    storageService.readModel("builtin:empty.mod");
    $scope.clearResults();
  };

  $scope.exportModel = function () {
    exportDialog.open(model);
  };

  $scope.loadModelFromDrive = function () {
    googlePickerService.pickDriveModel(function (fileId) {
      storageService.readModel('gdrive:' + fileId);
      $scope.clearResults();
    });
  };

  $scope.activateTab = function(id) {
    // TODO: This is a code smell; do this properly.
    var tabScope = angular.element(document.getElementById('main-tabs')).scope();
    tabScope.setActiveTab(id);
  };

  $scope.refresh = function() {
    uiChartRefreshService.refreshAll();
    window.setTimeout(function(){
      // Slightly hacky way to make ui-grid tables refresh
      $(window).resize();
      $rootScope.$emit('resizeMsg');
    }, 50);
  };

  $scope.focusOnEditor = function() {
    var aceEditorElement = angular.element('textarea.ace_text-input');
    aceEditorElement.focus();
  };

  // Initialize scope variables
  $scope.examples = examples;
  $scope.model = model;
  $scope.isComputing = false;
  $scope.clearResults();

  // Check cookie to see if the user has visited before;
  // if not, show the welcome dialog.
  var visitedBefore = $cookies.get('visitedBefore');
  if (visitedBefore !== "true") {
    $scope.showWelcome();
  }
  var now = new Date();
  $cookies.put('visitedBefore', true, {
    expire: new Date(now.getFullYear(), now.getMonth()+6, now.getDate())
  });
});

app.factory('model', function () {
  return {code: "", log: "", doc: "", results: []};
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
