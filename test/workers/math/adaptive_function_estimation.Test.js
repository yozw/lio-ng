'use strict';

describe("AFE", function () {

  it('should correctly create an interval', function () {
    var interval = new Interval(1, 2);
    expect(interval.start).toEqual(1);
    expect(interval.end).toEqual(2);
  });

  it('should correctly subdivide an interval', function () {
    var afe = new AFE();
    var interval = new Interval(1, 3);
    var subdivided = afe.subdivide(interval);
    expect(subdivided.left.start).toEqual(1);
    expect(subdivided.left.end).toEqual(2);
    expect(subdivided.right.start).toEqual(2);
    expect(subdivided.right.end).toEqual(3);

    expect(subdivided.left.previous).toEqual(undefined);
    expect(subdivided.left.next).toEqual(subdivided.right);
    expect(subdivided.right.previous).toEqual(subdivided.left);
    expect(subdivided.right.next).toEqual(undefined);
  });

  it('should correctly subdivide an interval with a given midpoint', function () {
    var afe = new AFE();
    var interval = new Interval(1, 3);
    var subdivided = afe.subdivide(interval, 2.5);
    expect(subdivided.left.start).toEqual(1);
    expect(subdivided.left.end).toEqual(2.5);
    expect(subdivided.right.start).toEqual(2.5);
    expect(subdivided.right.end).toEqual(3);
  });

  it('should correctly subdivide an interval in a chain of intervals', function () {
    var afe = new AFE();
    var interval1 = new Interval(0, 2);
    var interval2 = new Interval(2, 4);
    var interval3 = new Interval(4, 6);
    interval1.next = interval2;
    interval2.previous = interval1;
    interval2.next = interval3;
    interval3.previous = interval2;

    var subdivided = afe.subdivide(interval2);
    expect(subdivided.left.start).toEqual(2);
    expect(subdivided.left.end).toEqual(3);
    expect(subdivided.right.start).toEqual(3);
    expect(subdivided.right.end).toEqual(4);

    expect(subdivided.left.previous).toEqual(interval1);
    expect(subdivided.left.next).toEqual(subdivided.right);
    expect(subdivided.right.previous).toEqual(subdivided.left);
    expect(subdivided.right.next).toEqual(interval3);
  });

  it('should correctly estimate a linear function', function () {
    var afe = new AFE();
    var f = function(x) {
      return 30 + x * 5;
    };

    afe.estimate(f, 0, 10);
  });

  it('should correctly estimate a quadratic function', function () {
    var afe = new AFE();
    var f = function(x) {
      return 30 + x * x * 5;
    };

    afe.estimate(f, 0, 10);
  });

  it('should correctly estimate a sine function', function () {
    var afe = new AFE();
    var f = function(x) {
      return Math.sin(x);
    };

    afe.estimate(f, 0, 10);
  });
});
