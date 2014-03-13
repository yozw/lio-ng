var MAXITER = 300;
var PRECISION = 1e-6;
var SIMPLIFY_PRECISION = 1e-5;

var Interval = function (start, end) {
  this.start = start;
  this.end = end;
  this.length = end - start;
};

Interval.prototype.toString = function () {
  return "[" + this.start + "," + this.end + "]";
};

AFE = function () {
  "use strict";

  this.subdivide = function (interval, midpoint) {
    if (arguments.length == 1) {
      midpoint = (interval.start + interval.end) / 2;
    }
    var left = new Interval(interval.start, midpoint);
    var right = new Interval(midpoint, interval.end);

    left.previous = interval.previous;
    left.next = right;
    right.previous = left;
    right.next = interval.next;

    if (interval.previous !== undefined) {
      interval.previous.next = left;
    }
    if (interval.next !== undefined) {
      interval.next.previous = right;
    }

    return {left: left, right: right};
  };

  /** Calculates the slope of the piecewise interpolant of the function on the given interval **/
  var derivative = function (f, interval) {
    return (f(interval.end) - f(interval.start)) / interval.length;
  };

  /** Calculate the priority value of interval I. This priority value depends on
   the difference between derivative of I and the interval before and after I. **/
  var priority = function (f, interval) {
    var weight = 0;
    if (interval.previous !== undefined) {
      weight = Math.max(weight,
          interval.length * Math.abs(derivative(f, interval) - derivative(f, interval.previous)));
    }
    if (interval.next !== undefined) {
      weight = Math.max(weight,
          interval.length * Math.abs(derivative(f, interval) - derivative(f, interval.next)));
    }
    return weight;
  };

  this.estimate = function (oracle, start, end) {
    var f = oracle.memoize();
    var rootInterval = new Interval(start, end);
    var minimumIntervalLength = rootInterval.length * PRECISION;

    var intervalQueue = new PriorityQueue({
      comparator: function (interval1, interval2) {
        return priority(f, interval2) - priority(f, interval1);
      }});

    intervalQueue.queue(rootInterval);

    var iterations = 0;
    var stopWatch = new Stopwatch();
    stopWatch.start();

    while (intervalQueue.length > 0 && iterations++ < MAXITER) {
      var interval = intervalQueue.dequeue();

      /* evaluate function at a random midpoint */
      var mu = 0.2 + 0.6 * Math.random();
      var x = mu * interval.start + (1 - mu) * interval.end;
      x = Math.round(x / PRECISION) * PRECISION;
      var predicted = mu * f(interval.start) + (1 - mu) * f(interval.end);
      var actual = f(x);

      /* If the actual and predicted value are different enough, subdivide the interval and add the new intervals to
       the queue, provided that the intervals are not too small. */
      if (Math.abs(actual - predicted) > PRECISION * Math.abs(actual)) {
        var newIntervals = this.subdivide(interval, x);
        if (newIntervals.left.length > minimumIntervalLength) {
          intervalQueue.queue(newIntervals.left);
        }
        if (newIntervals.right.length > minimumIntervalLength) {
          intervalQueue.queue(newIntervals.right);
        }
      }
    }

    if (intervalQueue.length > 0) {
      console.warn("Iteration limit reached");
    }

    var sortedValues = [];
    for (var key in f.cache) {
      if (f.cache.hasOwnProperty(key)) {
        sortedValues.push([parseFloat(key), f.cache[key]]);
      }
    }
    sortedValues.sort(function (a, b) {
      return a[0] - b[0];
    });
    console.log("Function estimation took " + stopWatch.getElapsed() + " msec");
  }
};
