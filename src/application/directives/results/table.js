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

    var customOptions = $scope.customOptions;

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

    options = {};

    angular.extend(options, defaultOptions);
    angular.extend(options, customOptions);
    angular.extend(options, fixedOptions);

    $scope.options = options;

    $scope.$watch('search', function(value) {
      $scope.options.filterOptions.filterText = value;
    });

    $scope.$watch('data', function(data) {
      $scope.options.columnDefs = getColumnDefs(data.columns);
      $scope.options.data = data.rows;
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
