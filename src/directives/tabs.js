var module = angular.module('ui.tabs', []);

module.directive('tabs', function () {
  "use strict";
  return {
    restrict: 'E',
    scope: {},
    transclude: true, 
    templateUrl: 'directives/tabs.html',
    link: function (scope, element) {
      scope.tabs = [];
      scope.activeTab = 0;
      
      var innerDivs = element.find("div");
      for (var i = 0; i < innerDivs.length; i++) {
        var child = angular.element(innerDivs[i]);
        if (child.hasClass('tab-pane')) {
          var tab = {name: child.attr('name'), element: child};
          scope.tabs.push(tab);
        }
      }
      scope.setActiveTab(0);
    },
    controller: function ($scope) {
      $scope.setActiveTab = function(index) {
        $scope.activeTab = index;
        for (var i = 0; i < $scope.tabs.length; i++) {
          if (i == index) {
            $scope.tabs[i].element.addClass('active');
          } else {
            $scope.tabs[i].element.removeClass('active');
          }
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
    transclude: true,
    replace: true,
    template: '<div class="tab-pane" ng-transclude></div>'
  };
});

