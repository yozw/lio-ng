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
    var feasibleBasicSolutions = [ [0, 0], [0, 6], [6, 0], [4.5, 4.5], [3, 6] ];
    var infeasibleBasicSolutions =  [ [0, 9], [0, 18], [9, 0], [7, 0], [7, 2], [7, -3], [4, 6], [7, 6] ];
    var basicSolutions = MathUtil.getBasicSolutions(A, b);
    expect(basicSolutions.feasible).toEqual(feasibleBasicSolutions);
    expect(basicSolutions.infeasible).toEqual(infeasibleBasicSolutions);
  });

  it('calculates intersections of a vertical line and box', function () {
    var a = [1, 0];
    var b = [1];
    expect(MathUtil.getLineEndpoints(a, b, -2, 2, -2, 2)).toEqual([[1, -2], [1, 2]]);
  });

  it('calculates intersections of a horizontal line and box', function () {
    var a = [0, 1];
    var b = [1];
    expect(MathUtil.getLineEndpoints(a, b, -2, 2, -2, 2)).toEqual([[-2, 1], [2, 1]]);
  });

  it('calculates intersections of a diagonal line and box, case 1', function () {
    var a = [1, 1];
    var b = [1];
    expect(MathUtil.getLineEndpoints(a, b, -2, 2, -2, 2)).toEqual([[-1, 2], [2, -1]]);
  });

  it('calculates intersections of a diagonal line and box, case 2', function () {
    var a = [1, 1];
    var b = [-1];
    expect(MathUtil.getLineEndpoints(a, b, -2, 2, -2, 2)).toEqual([[-2, 1], [1, -2]]);
  });

  it('calculates intersections of a diagonal line and box, case 3', function () {
    var a = [1, -1];
    var b = [1];
    expect(MathUtil.getLineEndpoints(a, b, -2, 2, -2, 2)).toEqual([[-1, -2], [2, 1]]);
  });

  it('calculates intersections of a diagonal line and box, case 3', function () {
    var a = [1, -1];
    var b = [-1];
    expect(MathUtil.getLineEndpoints(a, b, -2, 2, -2, 2)).toEqual([[-2, -1], [1, 2]]);
  });

  it('getBounds retrieves the bounds of a set of points', function () {
    var points = [[1, 2], [3, 4]];
    expect(MathUtil.getBounds(points)).toEqual({minX: 1, maxX: 3, minY: 2, maxY: 4});
  });

  it('getBounds works with negative numbers', function () {
    var points = [[-1, -2], [-3, -4]];
    expect(MathUtil.getBounds(points)).toEqual({minX: -3, maxX: -1, minY: -4, maxY: -2});
  });

  it('expandBounds expands bounds correctly', function() {
    var bounds = {minX: 1, maxX: 3, minY: 2, maxY: 6};
    expect(MathUtil.expandBounds(bounds, 0.5, 1)).toEqual({minX: 0.5, maxX: 3.5, minY: 1, maxY: 7});
  });

  it('expandBounds expands bounds correctly when a range has length zero', function() {
    var bounds = {minX: 1, maxX: 1, minY: 2, maxY: 6};
    expect(MathUtil.expandBounds(bounds, 0.5, 1)).toEqual({minX: 0.5, maxX: 1.5, minY: 1, maxY: 7});

    bounds = {minX: 1, maxX: 3, minY: 4, maxY: 4};
    expect(MathUtil.expandBounds(bounds, 0.5, 1)).toEqual({minX: 0.5, maxX: 3.5, minY: 3.5, maxY: 4.5});
  });

  it('isDigit works correctly', function() {
    expect(MathUtil.isDigit('1')).toEqual(true);
    expect(MathUtil.isDigit('0')).toEqual(true);
    expect(MathUtil.isDigit('9')).toEqual(true);
    expect(MathUtil.isDigit('.')).toEqual(false);
    expect(MathUtil.isDigit(' ')).toEqual(false);
  });

  it('expandToNumber works correctly', function() {
    expect(MathUtil.expandToNumber("hello 123", 3, 4)).toEqual({});
    expect(MathUtil.expandToNumber("hello 123", 3, 3)).toEqual({});
    expect(MathUtil.expandToNumber("123", 1, 1)).toEqual({text: '123', start: 0, end: 3});
    expect(MathUtil.expandToNumber("123 ", 1, 1)).toEqual({text: '123', start: 0, end: 3});
    expect(MathUtil.expandToNumber(" 123 ", 1, 1)).toEqual({text: '123', start: 1, end: 4});
    expect(MathUtil.expandToNumber(" -123 ", 1, 1)).toEqual({text: '-123', start: 1, end: 5});
    expect(MathUtil.expandToNumber("123.0", 1, 1)).toEqual({text: '123.0', start: 0, end: 5});
    expect(MathUtil.expandToNumber("10.123.30", 1, 1)).toEqual({text: '10.123', start: 0, end: 6});
    expect(MathUtil.expandToNumber("10.123.30", 4, 4)).toEqual({text: '10.123', start: 0, end: 6});
    expect(MathUtil.expandToNumber("10.123.30", 7, 7)).toEqual({text: '123.30', start: 3, end: 9});
  });
});

