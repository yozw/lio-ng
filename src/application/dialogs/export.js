app.factory('exportDialog', function ($modal, $log, errorDialog, solverService) {
  "use strict";

  var TEMPLATE =
      '<div class="modal-header">\
       <h3>Export model</h3>\
       </div>\
       <div class="modal-body">\
         Please specify the language to which to export the model:\
         <table>\
           <tr>\
             <td style="padding-right: 2em;">\
               <input type="radio" ng-model="options.language" value="gmpl" style="margin-right: 0.5em;">GNU MathProg (GMPL)<br/>\
             </td>\
             <td style="padding-right: 2em;">\
               <input type="radio" ng-model="options.language" value="lp" style="margin-right: 0.5em;">CPLEX LP<br/>\
             </td>\
             <td>\
               <input type="radio" ng-model="options.language" value="mps" style="margin-right: 0.5em;">MPS<br/>\
             </td>\
           </tr>\
         </table>\
       </div>\
       <div class="modal-footer">\
         <button class="btn btn-primary" ng-click="ok()">OK</button>\
         <button class="btn" ng-click="cancel()">Cancel</button>\
       </div>';

  var modalController = function (model) {
    return function ($scope, $modalInstance) {

      $scope.options = Object();
      $scope.options.language = "gmpl";
      $scope.model = model;

      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.close();
      };
    }
  };

  return {
    open: function (model) {
      $modal.open({
        template: TEMPLATE,
        controller: modalController(model),
        backdrop: 'static'
      });
    }};
});
