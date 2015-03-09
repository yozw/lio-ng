var module = angular.module('directives.mathjax', ['hc.marked']);

module.directive("mathjaxBind", function($log, marked) {

  MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [['$','$'], ['\\(','\\)']],
      processEscapes: true
    },
    skipStartupTypeset: true
  });

  var markedRenderer = new marked.Renderer();

  markedRenderer.link = function(href, title, text) {
    var html = marked.Renderer.prototype.link.call(this, href, title, text);
    return "<a target='_blank' " + html.substring(3);
  };


  marked.setOptions({
    renderer: markedRenderer,
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
      $log.error(error);
    }
  });

  return {
    restrict: "A",
    controller: ["$scope", "$element", "$attrs",
      function($scope, $element, $attrs) {
        $scope.$watch($attrs.mathjaxBind, function(value) {
          // Clear content
          $element.html("");
          if (angular.isUndefined(value)) {
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
