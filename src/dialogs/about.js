app.factory('aboutDialog', function ($modal) {
  "use strict";

  var TEMPLATE = '<div class="modal-header">\
    <h3>About this online solver</h3>\
    </div>\
    <div class="modal-body">\
    <p>This is the online solver for the book <a href="http://www.lio.yoriz.co.uk/">Linear and Integer Optimization:\
        Theory and Practice</a>.</p>\
    <p>&copy; Copyright 2014 Y. Zwols</p>\
    <p>This web application uses several third party libraries:</p>\
    <ul>\
    <li><a target="_blank" href="http://hgourvest.github.io/glpk.js/">Glpk.js</a>:\
    GNU Linear Programming Kit for Javascript</li>\
    <li><a target="_blank" href="http://ace.c9.io/">Ace</a>: high performance code editor for the web</li>\
    <li><a target="_blank" href="http://angularjs.org/">AngularJS</a>: HTML enhanced for web apps</li>\
    <li><a target="_blank" href="http://getbootstrap.com/">Bootstrap</a>: front-end framework</li>\
    <li><a target="_blank" href="https://github.com/mgomes/ConvexHull">convex_hull.js</a>: Javascript implementation of Andrew\'s Monotone Chain convex hull algorithm</li>\
    <li><a target="_blank" href="http://www.jquery.com/">jQuery</a>: write less, do more</li>\
    <li><a target="_blank" href="http://www.jqplot.com/">jqPlot</a>: graphing component</li>\
    <li><a target="_blank" href="https://github.com/chjj/marked">Marked</a>: JavaScript markdown parser and compiler</li>\
    <li><a target="_blank" href="https://www.mathjax.org/">MathJax</a>: Beautiful math in all browsers</li>\
    </ul>\
    </div>\
    <div class="modal-footer">\
    <button class="btn btn-primary" ng-click="ok()">OK</button>\
    </div>';

  return {
    open: function () {

      var modalController = function ($scope, $modalInstance) {
        $scope.ok = function () {
          $modalInstance.close();
        };

      };

      var modalInstance = $modal.open({
        template: TEMPLATE,
        controller: modalController
      });

      modalInstance.result.then(
          function () {
          },
          function () {
          });
    }};
});
