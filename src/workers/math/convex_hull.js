"use strict";

/** Class for computing a 2D convex hull for the given vertices. */
var ConvexHullPoint = function (i, a, d) {
  this.index = i;
  this.angle = a;
  this.distance = d;

  this.compare = function (p) {
    if (this.angle < p.angle)
      return -1;
    else if (this.angle > p.angle)
      return 1;
    else {
      if (this.distance < p.distance)
        return -1;
      else if (this.distance > p.distance)
        return 1;
    }
    return 0;
  }
};

var ConvexHull = function () {
  this.points = null;
  this.indices = null;

  this.getIndices = function () {
    return this.indices;
  };

  this.clear = function () {
    this.indices = null;
    this.points = null;
  };

  this.ccw = function (p1, p2, p3) {
    return (this.points[p2][0] - this.points[p1][0]) * (this.points[p3][1] - this.points[p1][1])
        - (this.points[p2][1] - this.points[p1][1]) * (this.points[p3][0] - this.points[p1][0]);
  };

  this.angle = function (o, a) {
    return Math.atan((this.points[a][1] - this.points[o][1]) / (this.points[a][0] - this.points[o][0]));
  };

  this.distance = function (a, b) {
    return ((this.points[b][0] - this.points[a][0]) * (this.points[b][0] - this.points[a][0])
        + (this.points[b][1] - this.points[a][1]) * (this.points[b][1] - this.points[a][1]));
  };

  this.compute = function (_points) {
    this.indices = null;
    if (_points.length < 3)
      return;
    this.points = _points;

    // Find the lowest point
    var min = 0;
    for (var i = 1; i < this.points.length; i++) {
      if (this.points[i][1] === this.points[min][1]) {
        if (this.points[i][0] < this.points[min][0])
          min = i;
      }
      else if (this.points[i][1] < this.points[min][1])
        min = i;
    }

    // Calculate angle and distance from base
    var al = [];
    var ang = 0.0;
    var dist = 0.0;
    for (i = 0; i < this.points.length; i++) {
      if (i === min)
        continue;
      ang = this.angle(min, i);
      if (ang < 0)
        ang += Math.PI;
      dist = this.distance(min, i);
      al.push(new ConvexHullPoint(i, ang, dist));
    }

    al.sort(function (a, b) {
      return a.compare(b);
    });

    // Create stack
    var stack = new Array(this.points.length + 1);
    var j = 2;
    for (i = 0; i < this.points.length; i++) {
      if (i === min)
        continue;
      stack[j] = al[j - 2].index;
      j++;
    }
    stack[0] = stack[this.points.length];
    stack[1] = min;

    var tmp;
    var M = 2;
    for (i = 3; i <= this.points.length; i++) {
      while (this.ccw(stack[M - 1], stack[M], stack[i]) <= 0)
        M--;
      M++;
      tmp = stack[i];
      stack[i] = stack[M];
      stack[M] = tmp;
    }

    this.indices = new Array(M);
    for (i = 0; i < M; i++) {
      this.indices[i] = stack[i + 1];
    }
  };
};
