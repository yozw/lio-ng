var module = angular.module('directives.mathjax', ['hc.marked']);

module.directive("mathjaxBind", function(marked) {

  MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [['$','$'], ['\\(','\\)']],
      processEscapes: true
    },
    skipStartupTypeset: true
  });

  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });

  MathJax.Hub.Register.MessageHook("End Process", function (message) {
    try {
      var element = $(message[1]);
      element.html(marked(element.html()));
      $(element).show();
    } catch (error) {
      console.log(error);
    }
  });

  return {
    restrict: "A",
    controller: ["$scope", "$element", "$attrs",
      function($scope, $element, $attrs) {
        $scope.$watch($attrs.mathjaxBind, function(value) {
          // Clear content
          $element.html("");
          if (value == undefined) {
            return;
          }

          // Add a new child div that will contain the rendered output
          var div = document.createElement('div');
          $element[0].appendChild(div);
          $(div).hide();
          $(div).html(value);
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, div]);
        });
      }]
  };
});