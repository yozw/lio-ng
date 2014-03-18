'use strict';

describe("MathUtil", function () {

  it('solve2x2 should correctly solve 2 x 2 linear systems', function () {
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

  it('multiplyVector should correctly multiply a vector', function () {
    expect(MathUtil.multiplyVector([1, 2], 2)).toEqual([2, 4]);
  });

  it('zeroes should correctly create a zero-vector', function () {
    expect(MathUtil.zeroes(2)).toEqual([0, 0]);
    expect(MathUtil.zeroes(0)).toEqual([]);
  });

});

