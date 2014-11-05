'use strict';

describe("Interval", function () {

  it('has correctly set properties', function () {
    var interval = new Interval(5, 12);
    expect(interval.start).toEqual(5);
    expect(interval.end).toEqual(12);
    expect(interval.length).toEqual(7);
  });

  it('is represented as a string', function () {
    var interval = new Interval(5, 12);
    expect(interval.toString()).toEqual("[5,12]");
  });

  it('subdivides an interval', function () {
    var interval = new Interval(1, 3);
    var subdivided = interval.subdivide();
    expect(subdivided.left.start).toEqual(1);
    expect(subdivided.left.end).toEqual(2);
    expect(subdivided.right.start).toEqual(2);
    expect(subdivided.right.end).toEqual(3);

    expect(subdivided.left.previous).toEqual(undefined);
    expect(subdivided.left.next).toEqual(subdivided.right);
    expect(subdivided.right.previous).toEqual(subdivided.left);
    expect(subdivided.right.next).toEqual(undefined);
  });

  it('subdivides an interval with a given midpoint', function () {
    var interval = new Interval(1, 3);
    var subdivided = interval.subdivide(2.5);
    expect(subdivided.left.start).toEqual(1);
    expect(subdivided.left.end).toEqual(2.5);
    expect(subdivided.right.start).toEqual(2.5);
    expect(subdivided.right.end).toEqual(3);
  });

  it('subdivides an interval in a chain of intervals', function () {
    var interval1 = new Interval(0, 2);
    var interval2 = new Interval(2, 4);
    var interval3 = new Interval(4, 6);
    interval1.next = interval2;
    interval2.previous = interval1;
    interval2.next = interval3;
    interval3.previous = interval2;

    var subdivided = interval2.subdivide();
    expect(subdivided.left.start).toEqual(2);
    expect(subdivided.left.end).toEqual(3);
    expect(subdivided.right.start).toEqual(3);
    expect(subdivided.right.end).toEqual(4);

    expect(subdivided.left.previous).toEqual(interval1);
    expect(subdivided.left.next).toEqual(subdivided.right);
    expect(subdivided.right.previous).toEqual(subdivided.left);
    expect(subdivided.right.next).toEqual(interval3);
  });
});

describe("AdaptiveFunctionEstimation", function () {

  function sqr(x) {
    return x * x;
  }

  /**
   * Calculates the average square difference between two functions on the interval [a, b].
   * @param f1 {function}
   * @param f2 {function}
   * @param a {number}
   * @param b {number}
   * @returns {number}
   */
  function avgSqrDifference(f1, f2, a, b) {
    var steps = 1000;
    var diffL2 = 0;
    for (var i = 0; i < steps; i++) {
      var x = Math.min(b, a + (b - a) * (i / (steps-1)));
      diffL2 += sqr(f1(x) - f2(x));
    }
    return diffL2 / steps;
  }

  it('creates an interval', function () {
    var interval = new Interval(1, 2);
    expect(interval.start).toEqual(1);
    expect(interval.end).toEqual(2);
  });

  it('estimates a linear function', function () {
    var afe = new AdaptiveFunctionEstimation();
    var f = function (x) {
      return 30 + x * 5;
    };

    var a = 0;
    var b = 10;

    afe.estimate(f, a, b);
    var g = afe.linearInterpolant();
    var error = avgSqrDifference(f, g, a, b);
    console.log("Error = " + error);
    expect(error).toBeLessThan(1e-8);
  });

  it('estimates a quadratic function', function () {
    var afe = new AdaptiveFunctionEstimation();
    var f = function (x) {
      return 30 + x * x * 5;
    };

    var a = 0;
    var b = 5;
    afe.estimate(f, a, b);
    var g = afe.linearInterpolant();

    var error = avgSqrDifference(f, g, a, b);
    console.log("Error = " + error);
    expect(error).toBeLessThan(1e-6);
  });

  it('estimates a sine function', function () {
    var afe = new AdaptiveFunctionEstimation();
    var f = function (x) {
      return Math.sin(x);
    };

    var a = 0;
    var b = 10;
    afe.estimate(f, a, b);
    var g = afe.linearInterpolant();
    var error = avgSqrDifference(f, g, a, b);
    console.log("Error = " + error);
    expect(error).toBeLessThan(1e-8);
  });
});
