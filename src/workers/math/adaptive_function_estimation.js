"use strict";

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

Interval.prototype.subdivide = function (midpoint) {
  if (midpoint === undefined) {
    midpoint = (this.start + this.end) / 2;
  }

  var left = new Interval(this.start, midpoint);
  var right = new Interval(midpoint, this.end);

  left.previous = this.previous;
  left.next = right;
  right.previous = left;
  right.next = this.next;

  if (this.previous !== undefined) {
    this.previous.next = left;
  }
  if (this.next !== undefined) {
    this.next.previous = right;
  }

  return {left: left, right: right};
};


var AdaptiveFunctionEstimation = function () {
  "use strict";

  var data;

  /**
   * Calculate the slope of the piecewise interpolant of the function on the given interval
   * @param f {function}
   * @param interval {Interval}
   * @returns {number}
   */
  function derivative(f, interval) {
    return (f(interval.end) - f(interval.start)) / interval.length;
  }

  /**
   * Calculate the priority value of interval I.
   *
   * This priority value depends on the difference between derivative of I and the interval before and after I.
   *
   * @param f {function}
   * @param interval {Interval}
   * @returns {number}
   */
  function priority(f, interval) {
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
  }

  /**
   * Runs the adaptive function estimation algorithm for the given oracle function on the interval [start, end]
   * @param oracle {function}
   * @param start {number}
   * @param end {number}
   * @returns {Array}
   */
  this.estimate = function (oracle, start, end) {
    var f = oracle.memoize();
    var rootInterval = new Interval(start, end);
    var minimumIntervalLength = rootInterval.length * PRECISION;

    if (PriorityQueue === undefined) {
      throw new Error("PriorityQueue is not defined.")
    }

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

      /* Evaluate function at a random midpoint */
      var mu = 0.2 + 0.6 * Math.random();
      var x = mu * interval.start + (1 - mu) * interval.end;
      x = Math.round(x / PRECISION) * PRECISION;
      var predicted = mu * f(interval.start) + (1 - mu) * f(interval.end);
      var actual = f(x);

      /* If the actual and predicted value are different enough, subdivide the interval and add the new intervals to
       the queue, provided that the intervals are not too small. */
      if (Math.abs(actual - predicted) > PRECISION * Math.abs(actual)) {
        var newIntervals = interval.subdivide(x);
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

    data = sortedValues;
    return data;
  };

  /**
   * Returns a function that is the linear interpolant of the estimated data points.
   * @returns {Function}
   */
  this.linearInterpolant = function() {
    if (data === undefined) {
      throw new Error("estimate() should be run first");
    }
    var minX = data[0][0];
    var maxX = data[data.length - 1][0];
    return function (x) {
      if ((x < minX) || (x > maxX)) {
        return NaN;
      }
      var a = 0;
      var b = data.length - 1;
      while (b - a > 1) {
        var m = Math.floor((a+b)/2);
        var xm = data[m][0];
        if (xm == x) {
          return data[m][1];
        } else if (xm < x) {
          a = m;
        } else {
          b = m;
        }
      }
      var xa = data[a][0];
      var xb = data[b][0];
      var ya = data[a][1];
      var yb = data[b][1];
      return ya + (x - xa) / (xb - xa) * (yb - ya);
    };
  };
};
