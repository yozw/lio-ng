var module = angular.module('directives.tabs', ['ui.chart']);

module.directive('tabs', function () {
  "use strict";
  return {
    restrict: 'E',
    scope: {},
    transclude: true,
    templateUrl: '/src/directives/tabs.html',
    link: function (scope, element) {
      scope.containers = [];
      scope.activeTab = -1;

      var innerDivs = element.find("div");
      for (var i = 0; i < innerDivs.length; i++) {
        var child = angular.element(innerDivs[i]);
        if (child.hasClass('tab-pane')) {
          var tab = {
            element: child,
            name: child.attr('name')
          };
          child.removeClass("active");
          scope.containers.push(tab);
        }
      }
      scope.setActiveTab(0);
    },
    controller: function ($scope) {
      $scope.setActiveTab = function (newActiveTab) {
        var element;
        var oldActiveTab = $scope.activeTab;

        // If the active tab is not changing, do nothing
        if (newActiveTab === oldActiveTab) {
          return;
        }

        // Deactivate current tab
        if (oldActiveTab >= 0 && oldActiveTab < $scope.containers.length) {
          element = $scope.containers[oldActiveTab].element;
          element.removeClass('active');
          element.data("onTabDeactivate")();
        }

        $scope.activeTab = newActiveTab;

        // Active new current tab
        if (newActiveTab >= 0 && newActiveTab < $scope.containers.length) {
          element = $scope.containers[newActiveTab].element;
          element.addClass('active');
          element.data("onTabActivate")();
        }
      };
    }
  }
});

module.directive('tabpane', function () {
  "use strict";
  return {
    require: "^tabs",
    restrict: "E",
    scope: {
      onActivate: '&ngActivate',
      onDeactivate: '&onDeactivate'
    },
    transclude: true,
    replace: true,
    template: '<div class="tab-pane" ng-transclude></div>',
    link: function(scope, element) {
      element.data("onTabActivate", function() {
        scope.onActivate();
      });
      element.data("onTabDeactivate", function() {
        scope.onDeactivate();
      });
    }
  };
});
