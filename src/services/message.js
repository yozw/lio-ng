/**
 * Butter bar code
 */
app.service('messageService', function ($rootScope) {
  "use strict";
  var idCounter = 0;

  return {
    get: function () {
      return this.status.message;
    },
    set: function (message, waitingIndicatorVisible) {
      if (arguments.length < 2) {
        waitingIndicatorVisible = false;
      }

      this.status.message = message;
      this.status.waitingIndicatorVisible = waitingIndicatorVisible;
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
      return ++idCounter;
    },
    clear: function () {
      this.status.message = "";
    },
    dismiss: function (msgid) {
      if (idCounter === msgid) {
        this.status.message = "";
      }
    },
    status: {
      message: ""
    }
  };
});
