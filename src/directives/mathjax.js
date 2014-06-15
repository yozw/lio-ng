var module = angular.module('directives.mathjax', ['hc.marked']);

module.directive("mathjaxBind", function(marked) {

  MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [['$','$'], ['\\(','\\)']],
      processEscapes: true
    },
    skipStartupTypeset: false
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

  function processWithMarked(value) {
    if (value == undefined) {
      return "";
    } else {
      return value;
    }


    value = value.replace("&", "\\&").replace("\\", "\\\\");
    return marked(value);
  }

  MathJax.Hub.Register.MessageHook("End Process", function (message) {
    console.log("End process");
    var element = $(message[1]);
    element.html(marked(element.html()));
    $(element).show();
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
