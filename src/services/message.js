/**
 * Butter bar code
 */
app.service('messageService', function ($rootScope) {
  "use strict";
  var idCounter = 0;

  function apply() {
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  }

  return {
    get: function () {
      return this.status.message;
    },
    set: function (message) {
      idCounter++;
      this.status.message = message;
      apply();
      return idCounter;
    },
    clear: function () {
      this.status.message = "";
    },
    dismiss: function (msgid) {
      if (idCounter == msgid) {
        this.status.message = "";
      }
    },
    status: {
      message: ""
    }
  };
});
