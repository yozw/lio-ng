"use strict";

var MathUtil = Object();

/**
 * Returns true if the two arguments are equal,
 * up to a given precision eps (which defaults to 1e-10).
 * @param a
 * @param b
 * @param eps
 * @returns {boolean}
 */
MathUtil.almostEqual = function (a, b, eps) {
  if (a === b) {
    return true;
  }

  if (eps === undefined) {
    eps = 1e-10;
  }

  var absDiff = Math.abs(a - b);
  if (absDiff < eps * Math.abs(a)) {
    return true;
  } else if (absDiff < eps * Math.abs(b)) {
    return true;
  } else if (absDiff < eps) {
    return true;
  }
  return false;
};

  /**
 * Solves the two-dimensional system of equations Ax = b, where A is a 2 x 2 matrix, and b and x are 2-vector.
 * @param A
 * @param b
 * @returns {Array}
 */
MathUtil.solve2x2 = function (A, b) {
  var det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  if (det === 0) {
    return null;
  }
  return [
    (A[1][1] * b[0] - A[0][1] * b[1]) / det,
    (A[0][0] * b[1] - A[1][0] * b[0]) / det
  ];
};

/**
 * Creates a zero-vector.
 * @param m
 * @returns {Array}
 */
MathUtil.zeroes = function (m) {
  var vector = [];
  for (var j = 0; j < m; j++) {
    vector.push(0);
  }
  return vector;
};

/**
 * Multiplies a vector by a scalar.
 * @param vector
 * @param factor
 * @returns {Array}
 */
MathUtil.multiplyVector = function (vector, factor) {
  var newVector = [];
  for (var i = 0; i < vector.length; i++) {
    newVector.push(vector[i] * factor);
  }
  return newVector;
};

/**
 * Determines whether a number is finite.
 * @returns {boolean} true if the argument is a number and it is finite.
 */
MathUtil.isFinite = function (number) {
  if (typeof number !== "number") {
    return false;
  }
  if (isNaN(number)) {
    return false;
  }
  return (number > -Number.MAX_VALUE) && (number < Number.MAX_VALUE);
};

/**
 * Determines whether a number is infinite.
 * @returns {boolean} true if the argument is a number and it is infinite.
 */
MathUtil.isInfinite = function (number) {
  if (typeof number !== "number") {
    return false;
  }
  if (isNaN(number)) {
    return false;
  }
  return (number <= -Number.MAX_VALUE) || (number >= Number.MAX_VALUE);
};

MathUtil.uniqueBy = function(array, keyFn) {
  var seen = {};
  return array.filter(function(element) {
    var key = keyFn(element);
    return (seen[key] === 1) ? 0 : seen[key] = 1;
  });
};

MathUtil.getBasicSolutions = function (matrix, rhs) {
  var feasible = [];
  var infeasible = [];

  for (var i = 0; i < matrix.length; i++) {
    for (var j = i + 1; j < matrix.length; j++) {
      // Solve 2 x 2 system corresponding to constraint i and j
      var A = [matrix[i], matrix[j]];
      var b = [rhs[i], rhs[j]];
      var point = MathUtil.solve2x2(A, b);

      // If the two constraints are linearly dependent, there is nothing to do
      if (point === null) {
        continue;
      }

      // Check if the calculated basic solution is feasible
      var isFeasible = true;
      for (var k = 0; k < matrix.length; k++) {
        var slack = rhs[k] - matrix[k][0] * point[0] - matrix[k][1] * point[1];
        if (slack < -1e-8) {
          isFeasible = false;
          break;
        }
      }
      if (isFeasible) {
        feasible.push(point);
      } else {
        infeasible.push(point);
      }
    }
  }

  return {
    feasible: MathUtil.uniqueBy(feasible, JSON.stringify),
    infeasible: MathUtil.uniqueBy(infeasible, JSON.stringify)
  };
};

MathUtil.getOptimalPoints = function (points, objVector) {
  var curBestObjective = -Infinity;
  var optimal = [];

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var z = 0;
    for (var j = 0; j < objVector.length; j++) {
      z += objVector[j] * point[j];
    }
    if (z >= curBestObjective) {
      if ((z > curBestObjective) && !MathUtil.almostEqual(z, curBestObjective)) {
        optimal = [];
        curBestObjective = z;
      }
      optimal.push(point);
    }
  }
  return {points: optimal, objectiveValue: curBestObjective};
};

/**
 * Calculates the two intersections between the two-dimensional line {@code normal . [x y] = rhs} and the two-dimensional
 * box given by {@code minX <= x <= maxX} and {@code minY <= y <= maxY}.
 *
 * @param normal {[]}
 * @param rhs {Number}
 * @param bounds {{minX: Number, maxX: Number, minY: Number, maxY: Number}}
 * @returns {![]}
 */

MathUtil.getLineEndpoints = function(normal, rhs, bounds) {
  var a = normal[0], b = normal[1];
  var x1, y1, x2, y2;

  // solve equation ax + by = c, staying inside the bounds
  // set by minX, maxX, minY, maxY
  if (b === 0) {
    return [ [rhs / a, bounds.minY], [rhs / a, bounds.maxY] ];
  } else if (a === 0) {
    return [ [bounds.minX, rhs / b], [bounds.maxX, rhs / b] ];
  }

  x1 = bounds.minX;
  x2 = bounds.maxX;
  y1 = (rhs - a * x1) / b;
  y2 = (rhs - a * x2) / b;
  if (y1 > bounds.maxY) {
    y1 = bounds.maxY;
    x1 = (rhs - b * y1) / a;
  } else if (y1 < bounds.minY) {
    y1 = bounds.minY;
    x1 = (rhs - b * y1) / a;
  }

  if (y2 > bounds.maxY) {
    y2 = bounds.maxY;
    x2 = (rhs - b * y2) / a;
  } else if (y2 < bounds.minY) {
    y2 = bounds.minY;
    x2 = (rhs - b * y2) / a;
  }
  return [ [x1, y1], [x2, y2] ];
};

/**
 * Takes a list of 2d points and calculates the minimum and maximum x and y values.
 * @param points
 * @returns {{minX: number, maxX: number, minY: number, maxY: number}}
 */
MathUtil.getBounds = function (points) {
  var minX = Infinity;
  var maxX = -Infinity;
  var minY = Infinity;
  var maxY = -Infinity;
  for (var i = 0; i < points.length; i++) {
    if (MathUtil.isFinite(points[i][0])) {
      minX = Math.min(points[i][0], minX);
      maxX = Math.max(points[i][0], maxX);
    }
    if (MathUtil.isFinite(points[i][1])) {
      minY = Math.min(points[i][1], minY);
      maxY = Math.max(points[i][1], maxY);
    }
  }
  return {minX: minX, maxX: maxX, minY: minY, maxY: maxY};
};

/**
 * Takes a dictionary containing minimum and maximum x and y values, and expands the bounds by an
 * {@code expansionFactor}. If the range is zero, it is expanded to have size {@code defaultRange}.
 * @param bounds
 * @param expansionFactor
 * @param defaultRange
 * @returns {{minX: number, maxX: number, minY: number, maxY: number}}
 */
MathUtil.expandBounds = function (bounds, expansionFactor, defaultRange) {
  var rangeX = bounds.maxX - bounds.minX;
  var rangeY = bounds.maxY - bounds.minY;
  var expandX, expandY;
  if (rangeX === 0) {
    expandX = defaultRange / 2;
  } else {
    expandX = expansionFactor * rangeX / 2;
  }
  if (rangeY === 0) {
    expandY = defaultRange / 2;
  } else {
    expandY = expansionFactor * rangeY / 2;
  }
  return {
    minX: bounds.minX - expandX,
    maxX: bounds.maxX + expandX,
    minY: bounds.minY - expandY,
    maxY: bounds.maxY + expandY
  };
};

MathUtil.niceSpacing = function(min, max, segments) {
  if (min === max) {
    return {low: min, high: max, stepSize: 0};
  }

  // weight of minimizing outer bounds vs getting the number of segments right
  var lambda = 0.5;
  var acceptableMantissas = [0.5, 1, 2, 2.5, 3, 4, 5, 10];

  var idealStepSize = (max - min) / segments;
  var scalingFactor = Math.pow(10, Math.floor(Math.log(idealStepSize) / Math.LN10));
  // We have: 1 <= idealStepSize / scalingFactor < 10

  var optimalSpacing;
  var bestZ = Infinity;

  for (var i = 0; i < acceptableMantissas.length; i++) {
    var stepSize = acceptableMantissas[i] * scalingFactor;
    var roundedMin = Math.floor(min / stepSize);
    var roundedMax = Math.ceil(max / stepSize);
    var steps = roundedMax - roundedMin;
    var z = Math.pow(steps - segments, 2)
        + lambda * Math.pow(roundedMin - min / stepSize, 2)
        + lambda * Math.pow(roundedMax - max / stepSize, 2);
    if (z < bestZ) {
      bestZ = z;
      optimalSpacing = {
        min: roundedMin * stepSize,
        max: roundedMax * stepSize,
        stepSize: stepSize
      };
    }
  }
  return optimalSpacing;
};

MathUtil.isDigit = function(ch) {
  return ch >= '0' && ch <= '9';
};

MathUtil.expandToNumber = function(text, start, end) {
  function isValid(start, end) {
    var str = text.substring(start, end);
    return (str.length > 0) && (str.length === str.trim().length) && !isNaN(Number(str));
  }

  if (start !== end && !isValid(start, end)) {
    return {};
  }

  while (true) {
    if (start > 0 && isValid(start - 1, end)) {
      start--;
    } else if (start > 1 && isValid(start - 2, end)) {
      start -= 2;
    } else {
      break;
    }
  }

  while (true) {
    if (end < text.length && isValid(start, end + 1)) {
      end++;
    } else if (end < text.length - 1 && isValid(start, end + 2)) {
      end += 2;
    } else {
      break;
    }
  }

  if (!isValid(start, end)) {
    return {};
  }

  return {text: text.substring(start, end), start: start, end: end};
};
