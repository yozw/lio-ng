var app = angular.module('lio-ng',
    [ 'ui.bootstrap',
      'ui.ace',
      'ui.chart',
      'ui.grid',
      'directives.tabs',
      'directives.resizable',
      'directives.results.container',
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
    $scope,
    $compile,
    $cookies,
    model,
    examples,
    jqPlotRenderService,
    solverService,
    storageService,
    messageService,
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

  // Bind solver service callback
  solverService.setCallback({
    start: function() {
      $scope.clearResults();
      $scope.isComputing = true;
    },
    output: function(message) {
      pushResult('output', {type: 'verbatim', text: message});
      $scope.$apply();
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
    emitTable: function (message, target) {
      pushResult(target, {type: 'table', table: message});
      $scope.$apply();
    },
    emitGraph: function (message, target) {
      pushResult(target, {type: 'graph', graph: jqPlotRenderService.render(message)});
      $scope.$apply();
    }
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
    if (url !== undefined) {
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

  // Initialize scope variables
  $scope.examples = examples;
  $scope.model = model;
  $scope.isComputing = false;
  $scope.clearResults();

  // TODO: In newer versions of angular, use .get()
  var visitedBefore = $cookies.visitedBefore;
  if (visitedBefore !== "true") {
    $scope.showWelcome();
  }
  $cookies.visitedBefore = "true";
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

app.controller('ResultsTabCtrl', function ($scope, uiChartRefreshService, $log) {
  "use strict";
  $scope.refresh = function() {
    uiChartRefreshService.refreshAll();
    window.setTimeout(function(){
      // Slightly hacky way to make ui-grid tables refresh
      $(window).resize();
    }, 50);
  };
});

app.controller('EditorTabCtrl', function ($scope) {
  "use strict";
  $scope.focusOnEditor = function() {
    var aceEditorElement = angular.element('textarea.ace_text-input');
    aceEditorElement.focus();
  };
});

