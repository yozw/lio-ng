app.service('retryService', function () {
  "use strict";

  var RetryBuilder = function() {
    var self = this;
    var _maxAttempts = 100;
    var _remainingAttempts = 0;
    var _callFn = function() {};
    var _timeout = 100;
    var _successCheck = function() { return true; };
    var _onSuccess = function() { return true; };
    var _onAttemptFail = function() { return false; };
    var _onFail = function() { return false; };
    var _setTimeOut = setTimeout;

    function attemptRun() {
      var success = false;
      var return_value;
      var error_message;
      try {
        return_value = _callFn();
        if (_successCheck()) {
          success = true;
        } else {
          error_message = "successCheck returned false";
        }
      } catch (exception) {
        error_message = exception;
      }

      if (success) {
        _onSuccess();
        return return_value;
      } else {
        _onAttemptFail(error_message);
        _remainingAttempts--;
        if (_remainingAttempts <= 0) {
          _onFail();
          return false;
        }
        _setTimeOut(attemptRun, _timeout);
      }
    }

    this.call = function (callFn) {
      _callFn = callFn;
      return self;
    };
    this.onSuccess = function(onSuccess) {
      _onSuccess = onSuccess;
      return self;
    };
    this.successCheck = function(successCheckFn) {
      _successCheck = successCheckFn;
      return self;
    };
    this.onAttemptFail = function(onFailedAttempt) {
      _onAttemptFail = onFailedAttempt;
      return self;
    };
    this.onFail = function(onFail) {
      _onFail = onFail;
      return self;
    };
    this.timeout = function(timeout) {
      _timeout = timeout;
      return self;
    };
    this.maxAttempts = function (maxAttempts) {
      _maxAttempts = maxAttempts;
      return self;
    };
    this.withSetTimeout = function (setTimeOut) {
      _setTimeOut = setTimeOut;
      return self;
    };
    this.run = function() {
      _remainingAttempts = _maxAttempts;
      return attemptRun();
    }
  };

  return {
    retry: function() {
      return new RetryBuilder();
    }
  }
});
