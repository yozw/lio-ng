"use strict";

var MathUtil = Object();

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

MathUtil.uniqueBy = function(array, keyFn) {
  var seen = {};
  return array.filter(function(element) {
    var key = keyFn(element);
    return (seen[key] === 1) ? 0 : seen[key] = 1;
  });
};

MathUtil.getVertices = function (matrix, rhs) {
  var vertices = [];
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
        vertices.push(point);
      }
    }
  }
  return MathUtil.uniqueBy(vertices, JSON.stringify);
};

/**
 * Calculates the two intersections between the two-dimensional line {@code normal . [x y] = rhs} and the two-dimensional
 * box given by {@code minX <= x <= maxX} and {@code minY <= y <= maxY}.
 *
 * @param normal
 * @param rhs
 * @param minX
 * @param maxX
 * @param minY
 * @param maxY
 * @returns {*[]}
 */

MathUtil.getLineEndpoints = function(normal, rhs, minX, maxX, minY, maxY) {
  var a = normal[0], b = normal[1];
  var x1, y1, x2, y2;

  // solve equation ax + by = c, staying inside the bounds
  // set by minX, maxX, minY, maxY
  if (b === 0) {
    return [ [rhs / a, minY], [rhs / a, maxY] ];
  } else if (a === 0) {
    return [ [minX, rhs / b], [maxX, rhs / b] ];
  }

  x1 = minX;
  x2 = maxX;
  y1 = (rhs - a * x1) / b;
  y2 = (rhs - a * x2) / b;
  if (y1 > maxY) {
    y1 = maxY;
    x1 = (rhs - b * y1) / a;
  } else if (y1 < minY) {
    y1 = minY;
    x1 = (rhs - b * y1) / a;
  }

  if (y2 > maxY) {
    y2 = maxY;
    x2 = (rhs - b * y2) / a;
  } else if (y2 < minY) {
    y2 = minY;
    x2 = (rhs - b * y2) / a;
  }
  return [ [x1, y1], [x2, y2] ];
}

/**
 * Takes a list of 2d points and calculates the minimum and maximum x and y values.
 * @param points
 * @returns {{minX: number, maxX: number, minY: number, maxY: number}}
 */
MathUtil.getBounds = function (points) {
  var minX = points[0][0];
  var maxX = points[0][0];
  var minY = points[0][1];
  var maxY = points[0][1];
  for (var i = 1; i < points.length; i++) {
    minX = Math.min(points[i][0], minX);
    maxX = Math.max(points[i][0], maxX);
    minY = Math.min(points[i][1], minY);
    maxY = Math.max(points[i][1], maxY);
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

MathUtil.isDigit = function(ch) {
  return ch >= '0' && ch <= '9';
};

MathUtil.expandToNumber = function(text, start, end) {
  function isValid(start, end) {
    var str = text.substring(start, end);
    return (str.length > 0) && (str.length == str.trim().length) && !isNaN(Number(str));
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

