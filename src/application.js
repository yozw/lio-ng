var app = angular.module('lio-ng', ['ui.bootstrap', 'ui.ace', 'ui.tabs']);

app.controller('AppCtrl', ['$scope', function ($scope) {
  $scope.model = Object();
  $scope.model.code = "Hello!";
}]);

/**
 * Directive for components that may change their size depending on the window size.
 */
app.directive('resizable', function ($window) {
  return function ($scope) {
    $scope.updateWindowSize = function () {
      $scope.windowHeight = $window.innerHeight;
      $scope.windowWidth = $window.innerWidth;
    };

    angular.element($window).bind("resize", function () {
      $scope.updateWindowSize();
      $scope.$apply();
    });

    $scope.updateWindowSize();
  }
});

/**
 * Butter bar code
 */
app.service('messageService', function (statusMessage) {
  return {
    get:function () {
      return statusMessage.message;
    },
    set:function (message) {
      statusMessage.message = message;
    },
    clear:function () {
      statusMessage.message = '';
    }
  };
})

app.factory('statusMessage', function() {
  return {message: ""};
});

app.controller('ButterBarCtrl', ['$scope', 'statusMessage', function ($scope, statusMessage) {
  $scope.statusMessage = statusMessage;
}]);

