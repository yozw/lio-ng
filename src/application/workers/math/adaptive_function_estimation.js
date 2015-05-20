"use strict";

var Interval = function (start, end) {
  this.start = start;
  this.end = end;
  this.length = end - start;
};

Interval.prototype.toString = function () {
  return "[" + this.start + "," + this.end + "]";
};

Interval.prototype.subdivide = function (midpoint) {
  if (!midpoint) {
    midpoint = (this.start + this.end) / 2;
  }

  var left = new Interval(this.start, midpoint);
  var right = new Interval(midpoint, this.end);

  left.previous = this.previous;
  left.next = right;
  right.previous = left;
  right.next = this.next;

  if (this.previous) {
    this.previous.next = left;
  }
  if (this.next) {
    this.next.previous = right;
  }

  return {left: left, right: right};
};


var AdaptiveFunctionEstimation = function () {
  "use strict";

  var data;

  var START_SUBDIVISIONS = 4;
  var MAXITER = 300;
  var PRECISION = 1e-6;
  var SIMPLIFY_PRECISION = 1e-5;

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
   * Determines the "value type" of the provided value, i.e., it returns
   * 0 if the value is finite, -1 if it is -Infinity, and +1 if it is
   * +Infinity.
   *
   * @param value
   * @returns {number}
   */
  function valueType(value) {
    if (MathUtil.isFinite(value)) {
      return 0;
    } else if (value < 0) {
      return -1;
    } else {
      return 1;
    }
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
    var startValueType = valueType(f(interval.start));
    var endValueType = valueType(f(interval.end));

    if (startValueType !== endValueType) {
      return interval.length;
    }

    if (startValueType === 0 && endValueType === 0) {
      if (interval.previous) {
        weight = Math.max(weight,
            interval.length * Math.abs(derivative(f, interval) - derivative(f, interval.previous)));
      }
      if (interval.next) {
        weight = Math.max(weight,
            interval.length * Math.abs(derivative(f, interval) - derivative(f, interval.next)));
      }
    }
    return weight;
  }

  /**
   * Subdivides a give interval {@code subdivisions} times.
   * @param interval {Interval}
   * @param subdivisions {Number}
   * @returns {Array}
   */
  function subdivideInterval(interval, subdivisions) {
    var list = [interval];
    for (var i = 0; i < subdivisions; i++) {
      var newList = [];
      for (var k = 0; k < list.length; k++) {
        var newIntervals = list[k].subdivide();
        newList.push(newIntervals.left);
        newList.push(newIntervals.right);
      }
      list = newList;
    }
    return list;
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
    var minimumIntervalLength = Math.abs(end - start) * PRECISION;

    if (!PriorityQueue) {
      throw new Error("PriorityQueue is not defined.")
    }

    var intervalQueue = new PriorityQueue({
      comparator: function (interval1, interval2) {
        return priority(f, interval2) - priority(f, interval1);
      }});

    var startIntervals = subdivideInterval(new Interval(start, end), START_SUBDIVISIONS);
    for (var i = 0; i < startIntervals.length; i++) {
      intervalQueue.queue(startIntervals[i]);
    }

    var iterations = 0;
    var stopWatch = new Stopwatch();
    stopWatch.start();

    while (intervalQueue.length > 0 && iterations++ < MAXITER) {
      var interval = intervalQueue.dequeue();
      var startValueType = valueType(f(interval.start));
      var endValueType = valueType(f(interval.end));
      var subdivide = true;

      /* Take a random midpoint */
      var mu = 0.2 + 0.6 * Math.random();
      var x = mu * interval.start + (1 - mu) * interval.end;
      x = Math.round(x / PRECISION) * PRECISION;

      // If the problem is feasible at both the start point, and the end point,
      // see if we can avoid subdividing
      if (startValueType === 0 && endValueType === 0) {
        // Evaluate function at a the chosen midpoint
        var predicted = mu * f(interval.start) + (1 - mu) * f(interval.end);
        var actual = f(x);

        // If the actual and predicted value are different enough, subdivide
        subdivide = Math.abs(actual - predicted) > PRECISION * Math.abs(actual);
      }

      if (subdivide) {
        // Subdivide the interval and add the new intervals to the queue,
        // provided that the intervals are not too small.
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
        sortedValues.push([parseFloat(key), f.cache[key], f(parseFloat(key))]);
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
    if (!data) {
      throw new Error("estimate() should be run first");
    }
    var minX = data[0][0];
    var maxX = data[data.length - 1][0];
    return function (x) {
      if (x < minX) {
        return data[0][1];
      } else if (x > maxX) {
        return data[data.length - 1][1];
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
