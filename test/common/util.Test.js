'use strict';

describe("Stopwatch", function () {

  var time;
  var stopwatch = new Stopwatch(function() { return time; });

  beforeEach(function () {
    time = 100;
  });

  it('returns zero elapsed time if not started', function () {
    time++;
    expect(stopwatch.getElapsed()).toEqual(0);
  });

  it('returns zero elapsed time if cleared', function () {
    stopwatch.start();
    time++;
    stopwatch.stop();
    time++;
    stopwatch.clear();
    expect(stopwatch.getElapsed()).toEqual(0);
  });

  it('returns time between start and now if started but not stopped', function () {
    stopwatch.start();
    time++;
    expect(stopwatch.getElapsed()).toEqual(1);
  });

  it('returns time between start and stopped time', function () {
    stopwatch.start();
    time++;
    stopwatch.stop();
    time++;
    expect(stopwatch.getElapsed()).toEqual(1);
  });

});


describe("Memoizer", function () {

  var functionCalls;
  var square = function(x) {
    functionCalls++;
    return x * x;
  };

  beforeEach(function () {
    functionCalls = 0;
  });


  it('memoizes function calls', function () {
    var wrapper = square.memoize();
    wrapper(4);
    wrapper(4);
    expect(functionCalls).toEqual(1);
    expect(wrapper(4)).toEqual(16);
  });

  it('has a cache map', function () {
    var wrapper = square.memoize();
    wrapper(2);
    wrapper(2);
    wrapper(4);
    wrapper(4);
    expect(functionCalls).toEqual(2);
    expect(wrapper.cache[2]).toEqual(4);
    expect(wrapper.cache[4]).toEqual(16);
  });

});

