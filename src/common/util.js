"use strict"

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
      return Math.round(clockFunction() - startTime);
    } else {
      return Math.round(endTime - startTime);
    }
  };
};

Function.prototype.memoize = function () {
  var self = this;
  var cache = {};
  var wrapper = function (arg) {
    if (arg in cache) {
      return cache[arg];
    } else {
      return cache[arg] = self(arg);
    }
  }
  wrapper.cache = cache;
  return wrapper;
};

