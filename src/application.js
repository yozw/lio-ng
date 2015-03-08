var app = angular.module('lio-ng',
    [ 'ui.bootstrap',
      'ui.ace',
      'ui.chart',
      'directives.tabs',
      'directives.resizable',
      'directives.resultgraph',
      'directives.resulttable',
      'directives.resultverbatim',
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
    examples,
    jqPlotRenderService,
    solverService,
    storageService,
    messageService,
    googlePickerService,
    aboutDialog,
    sensitivityDialog,
    feedbackDialog,
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

  // Bind solver service callback
  solverService.setCallback({
    start: function() {
      model.log = "";
      model.results = [];
      $scope.isComputing = true;
    },
    output: function(message) {
      $scope.model.results.push(
          {type: 'verbatim', text: message}
      );
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
    emitTable: function (table) {
      $scope.model.results.push(
          {type: 'table', table: table}
      );
      $scope.$apply();
    },
    emitGraph: function (graph) {
      $scope.model.results.push(
          {type: 'graph', graph: jqPlotRenderService.render(graph)}
      );
      $scope.$apply();
    }
  });

  // Initialize scope variables
  $scope.examples = examples;
  $scope.model = model;
  $scope.isComputing = false;

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

  $scope.showFeedback = function () {
    feedbackDialog.open();
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
    }
  };

  $scope.loadModelFromDrive = function () {
    googlePickerService.pickDriveModel(function (fileId) {
      storageService.readModel('gdrive:' + fileId);
    });
  };
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

