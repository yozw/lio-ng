'use strict';

describe("MathUtil", function () {

  it('solves 2 x 2 linear systems', function () {
    var A, b;

    A = [[2, 0], [0, 2]];
    b = [1, 2];
    expect(MathUtil.solve2x2(A, b)).toEqual([0.5, 1]);

    A = [[2, -4], [3, -5]];
    b = [6, 15];
    expect(MathUtil.solve2x2(A, b)).toEqual([15, 6]);

    A = [[2, 2], [4, 4]];
    b = [1, 2];
    expect(MathUtil.solve2x2(A, b)).toEqual(null);
  });

  it('multiplies a vector', function () {
    expect(MathUtil.multiplyVector([1, 2], 2)).toEqual([2, 4]);
  });

  it('creates a zero-vector', function () {
    expect(MathUtil.zeroes(2)).toEqual([0, 0]);
    expect(MathUtil.zeroes(0)).toEqual([]);
  });

  it('determine finiteness', function () {
    expect(MathUtil.isFinite(2)).toEqual(true);
    expect(MathUtil.isFinite(Number.MAX_VALUE)).toEqual(false);
    expect(MathUtil.isFinite(-Number.MAX_VALUE)).toEqual(false);
    expect(MathUtil.isFinite(NaN)).toEqual(false);
    expect(MathUtil.isFinite("")).toEqual(false);
    expect(MathUtil.isFinite("5")).toEqual(false);
  });

  it('determines the vertices of a set of linear inequalities', function () {
    var A = [[-1, 0], [0, -1], [1, 1], [3, 1], [1, 0], [0, 1]];
    var b = [0, 0, 9, 18, 7, 6];
    var expectedVertices = [ [0, 0], [0, 6], [6, 0], [4.5, 4.5], [3, 6] ];
    expect(MathUtil.getVertices(A, b)).toEqual(expectedVertices);
  });

});

