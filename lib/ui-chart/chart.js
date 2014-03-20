var module = angular.module('ui.chart', []);

module.directive('uiChart', function (uiChartRefreshService) {
    return {
      restrict: 'EACM',
      template: '<div></div>',
      replace: true,
      link: function (scope, elem, attrs) {
        var renderChart = function () {
          console.log('Rendering chart');
          var data = scope.$eval(attrs.uiChart);
          elem.html('');
          if (!angular.isArray(data)) {
            return;
          }

          var opts = {};
          if (!angular.isUndefined(attrs.chartOptions)) {
            opts = scope.$eval(attrs.chartOptions);
            if (!angular.isObject(opts)) {
              throw 'Invalid ui.chart options attribute';
            }
          }

          elem.jqplot(data, opts);
        };

        scope.$watch(attrs.uiChart, function () {
          renderChart();
        }, true);

        scope.$watch(attrs.chartOptions, function () {
          renderChart();
        });

        scope.uiChartRefreshService = uiChartRefreshService;

        scope.$watch('uiChartRefreshService', function () {
          renderChart();
        }, true);
      }
    };
  });
  

/**
 * A service that helps refresh all charts. This is sometimes required when charts are 
 * inside e.g. tabs.
 **/
module.service('uiChartRefreshService', function () {
  "use strict";
  return {
    refreshAll: function (message) {
      this.token.value++;
    },
    token: {
      value: 0
    }
  };
});


