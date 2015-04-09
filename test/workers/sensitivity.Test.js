'use strict';

describe("SensitivityAnalysis", function () {

  var DOVETAIL_RHS = "var x1 >= 0;\n"
      + "var x2 >= 0;\n"
      + "maximize z: 3*x1 + 2*x2;\n"
      + "subject to c11: x1 + x2 <= 9;\n"
      + "subject to c12: 3*x1 + x2 <= {{SENSITIVITY_PLACEHOLDER}};\n"
      + "subject to c13: x1 <=  7;\n"
      + "subject to c14: x2 <=  6;\n"
      + "end;";

  var PRECISION = 3;  // decimal precision for "toBeCloseTo" matcher

  function interpolate(x, data) {
    var a = 0;
    var b = data.length - 1;
    if (x < data[a][0] || x > data[b][0]) {
      throw "Value of x is out of range";
    }
    // Invariant: data[a][0] <= x <= data[b][0]
    while (b - a > 1) {
      var m = Math.floor((a + b) / 2);
      if (data[m][0] < x) {
        a = m;
      } else {
        b = m;
      }
    }
    return (data[b][1] * (x - data[a][0]) + data[a][1] * (data[b][0] - x)) / (data[b][0] - data[a][0]);
  }

  it('the adaptive algorithm correctly performs a rhs perturbation', function () {
    var analysis = new SensitivityAnalysis();
    analysis.setAlgorithm('adaptive');
    var rawData = analysis.run(DOVETAIL_RHS, 0, 32, 0);
    var segments = analysis.partitionData(rawData);

    // Expect one segment for the finite objective values
    expect(segments.length).toEqual(1);
    var data = segments[0].data;

    expect(interpolate(0, data)).toBeCloseTo(0, PRECISION);
    expect(interpolate(6, data)).toBeCloseTo(12, PRECISION);
    expect(interpolate(12, data)).toBeCloseTo(18, PRECISION);
    expect(interpolate(15, data)).toBeCloseTo(21, PRECISION);
    expect(interpolate(18, data)).toBeCloseTo(22.5, PRECISION);
    expect(interpolate(24, data)).toBeCloseTo(25, PRECISION);
    expect(interpolate(32, data)).toBeCloseTo(25, PRECISION);
  });

  it('the uniform algorithm correctly performs a rhs perturbation', function () {
    var analysis = new SensitivityAnalysis();
    analysis.setAlgorithm('uniform');
    var rawData = analysis.run(DOVETAIL_RHS, 0, 36, 0, {stepCount: 7});
    var segments = analysis.partitionData(rawData);

    // Expect one segment for the finite objective values
    expect(segments.length).toEqual(1);
    var data = segments[0].data;

    expect(interpolate(0, data)).toBeCloseTo(0, PRECISION);
    expect(interpolate(6, data)).toBeCloseTo(12, PRECISION);
    expect(interpolate(12, data)).toBeCloseTo(18, PRECISION);
    expect(interpolate(15, data)).toBeCloseTo(20.25, PRECISION);
    expect(interpolate(18, data)).toBeCloseTo(22.5, PRECISION);
    expect(interpolate(24, data)).toBeCloseTo(25, PRECISION);
    expect(interpolate(30, data)).toBeCloseTo(25, PRECISION);
    expect(interpolate(36, data)).toBeCloseTo(25, PRECISION);
  });

  it('the uniform algorithm correctly performs a rhs perturbation with a variable as a target', function () {
    var analysis = new SensitivityAnalysis();
    analysis.setAlgorithm('uniform');
    var rawData = analysis.run(DOVETAIL_RHS, 0, 36, 1, {stepCount: 7});
    var segments = analysis.partitionData(rawData);

    // Expect one segment for the finite objective values
    expect(segments.length).toEqual(1);
    var data = segments[0].data;

    expect(interpolate(0, data)).toBeCloseTo(0, PRECISION);
    expect(interpolate(6, data)).toBeCloseTo(0, PRECISION);
    expect(interpolate(12, data)).toBeCloseTo(2, PRECISION);
    expect(interpolate(15, data)).toBeCloseTo(3.25, PRECISION);
    expect(interpolate(18, data)).toBeCloseTo(4.5, PRECISION);
    expect(interpolate(24, data)).toBeCloseTo(7, PRECISION);
    expect(interpolate(30, data)).toBeCloseTo(7, PRECISION);
    expect(interpolate(36, data)).toBeCloseTo(7, PRECISION);
  });

  it('the adaptive algorithm correctly performs a rhs perturbation with feasibility and infeasibility', function () {
    var analysis = new SensitivityAnalysis();
    analysis.setAlgorithm('adaptive');
    var rawData = analysis.run(DOVETAIL_RHS, -6, 6, 0, {});
    var segments = analysis.partitionData(rawData);

    // Expect two segments: one infeasible, and one finite objective values
    expect(segments.length).toEqual(2);
    var data = segments[1].data;

    expect(segments[0].data[0][0]).toBeCloseTo(-6);
    expect(segments[0].data[0][1]).toEqual(-Infinity);
    expect(interpolate(0, data)).toBeCloseTo(0);
    expect(interpolate(6, data)).toBeCloseTo(12, PRECISION);
  });

  it('the adaptive algorithm correctly performs a rhs perturbation with infeasibility', function () {
    var analysis = new SensitivityAnalysis();
    analysis.setAlgorithm('adaptive');
    var rawData = analysis.run(DOVETAIL_RHS, -10, -1, 0, {});
    var segments = analysis.partitionData(rawData);
  });
});

describe("SensitivityAnalysis Async Action", function () {

  var DOVETAIL_RHS = "var x1 >= 0;\n"
      + "var x2 >= 0;\n"
      + "maximize z: 3*x1 + 2*x2;\n"
      + "subject to c11: x1 + x2 <= 9;\n"
      + "subject to c12: 3*x1 + x2 <= {{SENSITIVITY_PLACEHOLDER}};\n"
      + "subject to c13: x1 <=  7;\n"
      + "subject to c14: x2 <=  6;\n"
      + "end;";

  it('the worker action generates a graph', function() {
    var event = {};
    event.data = {minValue: 10, maxValue: 30, method: 'adaptive', code: DOVETAIL_RHS, column: 0};
    actionSensitivity(event);
  });

});
