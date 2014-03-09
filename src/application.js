var app = angular.module('lio-ng', ['ui.bootstrap', 'ui.ace', 'ui.tabs']);

app.directive('resizable', function($window) {
  return function($scope) {
    $scope.initializeWindowSize = function() {
      $scope.windowHeight = $window.innerHeight;
      $scope.windowWidth  = $window.innerWidth;
    };
    angular.element($window).bind("resize", function() {
      $scope.initializeWindowSize();
      $scope.$apply();
    });
    $scope.initializeWindowSize();
  }
});
      
function AppCtrl() {
  function moveEditor() {
    var node = document.getElementById("editor");
    var newParent = document.getElementById("model");
    if (newParent == null) {
      setTimeout(moveEditor, 10);
      return;
    }
    newParent.appendChild(node);
    node.style.display = "block";
  }
    
  moveEditor();
}
