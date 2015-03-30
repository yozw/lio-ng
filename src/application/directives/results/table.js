var module = angular.module('directives.results.table', []);

// TODO: Write unit tests
module.directive('resultsTable', function () {
  "use strict";

  var options = {};

  return {
    restrict: "E",
    replace: true,
    scope: {
      data: '='
    },
    template: '<div><div ui-grid="options" class="grid"></div></div>',
    controller: controller
  };

  function getColumnDefs(columns) {
    var columnDefs = [];
    for (var i = 0; i < columns.length; i++) {
      columnDefs.push({field: "" + i, displayName: columns[i].name, cellFilter: 'formatValue'});
    }
    return columnDefs;
  }

  function controller($scope) {
    $scope.selectedItems = [];

    var fixedOptions = {
      columnDefs  : getColumnDefs($scope.data.columns),
      data        : $scope.data.rows
    };

    var defaultOptions = {
      filterOptions         : {
        filterText        : '',
        useExternalFilter : false
      }
    };

    $scope.options = {};

    angular.extend($scope.options, defaultOptions);
    angular.extend($scope.options, $scope.customOptions);
    angular.extend($scope.options, fixedOptions);

    $scope.$watch('search', function(value) {
      $scope.options.filterOptions.filterText = value;
    });

    $scope.$watch('data', function(data) {
      $scope.options.columnDefs = getColumnDefs(data.columns);
      $scope.options.data = data.rows;
      $scope.options.showHeader = data.options.showHeader;
      //$scope.gridApi.core.refresh();
    });
  }
});

module.filter('formatValue', function () {
  return function (value) {
    if (typeof value === "number") {
      if (value > 1e308) {
        return "Inf";
      } else if (value < -1e308) {
        return "-Inf";
      } else {
        return parseFloat(value.toFixed(7));
      }
    } else {
      return value;
    }
  };
});
