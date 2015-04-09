"use strict";

function checkDefined(obj) {
  if (obj === undefined) {
    throw "checkDefined failed";
  }
  return obj;
}

/**
 * Stopwatch that measures elapsed time
 * @param [clockFunction] optional clock function for unit testing
 * @constructor
 */
var Stopwatch = function (clockFunction) {
  if (arguments.length < 1) {
    clockFunction = function () {
      return new Date().getTime();
    };
  }

  var startTime;
  var endTime;

  this.start = function () {
    startTime = clockFunction();
    endTime = null;
  };

  this.stop = function () {
    endTime = clockFunction();
  };

  this.clear = function () {
    startTime = null;
    endTime = null;
  };

  this.getElapsed = function () {
    if (!endTime) {
      if (!startTime) {
        return 0;
      } else {
        return Math.round(clockFunction() - startTime);
      }
    } else {
      return Math.round(endTime - startTime);
    }
  };
};

/**
 * Prototype function that turns any function into a memoized version.
 * @returns {wrapper} the memoized function
 */
Function.prototype.memoize = function () {
  var self = this;
  var cache = {};
  var wrapper = function (arg) {
    if (arg in cache) {
      return cache[arg];
    } else {
      return cache[arg] = self(arg);
    }
  };
  wrapper.cache = cache;
  return wrapper;
};

/**
 * jQuery-like extend function (used by workers that do not import jQuery).
 * @param options
 * @param extraOptions
 * @returns {*}
 */
function extend(options, extraOptions) {
  if (extraOptions !== undefined && extraOptions !== null) {
    for (var key in extraOptions) {
      if (extraOptions.hasOwnProperty(key)) {
        options[key] = extraOptions[key];
      }
    }
  }
  return options;
}
