var module = angular.module('directives.mathjax', []);

module.directive("mathjaxBind", function() {
  MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [['$','$'], ['\\(','\\)']],
      processEscapes: true
    }
  });

  return {
    restrict: "A",
    controller: ["$scope", "$element", "$attrs",
      function($scope, $element, $attrs) {
        $scope.$watch($attrs.mathjaxBind, function(value) {
          console.log("Reprocess: " + value);
          $element.html(value == undefined ? "" : value);
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
        });
      }]
  };
});
