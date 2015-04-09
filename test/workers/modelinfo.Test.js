'use strict';

describe("ModelInfo Async Action", function () {

  var MODEL = "var x1 >= 0;\n"
      + "var x2 >= 0 integer;\n"
      + "var x3 >= 0 integer;\n"
      + "var x4 >= 0 binary;\n"
      + "var x5 >= 0 binary;\n"
      + "var x6 >= 0 binary;\n"
      + "maximize z: 3*x1 + 2*x2;\n"
      + "subject to c11: x1 + x2 <= 9;\n"
      + "subject to c12: 3*x1 + x2 + x6 <= 18;\n"
      + "subject to c13: x1 + x4 + x5 + x6 <= 7;\n"
      + "subject to c14: x2 + x3 <=  6;\n"
      + "end;";

  it('returns the correct numbers of variables', function () {
    var e = {data: {code: MODEL}};
    var info = actionModelInfo(e);
    expect(info.numVariables).toEqual(6);
    expect(info.numContinous).toEqual(1);
    expect(info.numInteger).toEqual(2);
    expect(info.numBinary).toEqual(3);

    var expectedVariables = [
      {column: 1, name: 'x1', kind: 'Real'},
      {column: 2, name: 'x2', kind: 'Integer'},
      {column: 3, name: 'x3', kind: 'Integer'},
      {column: 4, name: 'x4', kind: 'Binary'},
      {column: 5, name: 'x5', kind: 'Binary'},
      {column: 6, name: 'x6', kind: 'Binary'}
    ];
    expect(info.variables).toEqual(expectedVariables);
  });
});
