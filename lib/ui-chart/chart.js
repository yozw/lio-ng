var module = angular.module('ui.chart', []);

module.directive('uiChart', function (uiChartRefreshService, $timeout) {
  "use strict"
  return {
    restrict: 'EACM',
    template: '<div></div>',
    replace: true,
    link: function (scope, elem, attrs) {
      var needsRefresh = false;
      
      /**
       * Renders the chart
       **/
      function renderChart() {
        needsRefresh = false;
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
      
      /**
       * Schedules a fresh chart rendering within the next 50 milliseconds. Refreshing the chart
       * is an expensive operation. To minimize the number of refreshes, the refresh is postponed 
       * for a short period of time, so that any other refresh-triggering events in the same time 
       * interval only result in one actual refresh.
       **/
      function scheduleRefresh() {
        needsRefresh = true;
        $timeout(function() {
          if (needsRefresh) {
            renderChart();
          }
        }, 50);
      }

      scope.$watch(attrs.uiChart, function () {
        scheduleRefresh();
      }, true);

      scope.$watch(attrs.chartOptions, function () {
        scheduleRefresh();
      });

      scope.uiChartRefreshService = uiChartRefreshService;

      scope.$watch('uiChartRefreshService', function () {
        scheduleRefresh();
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


