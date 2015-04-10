'use strict';

describe("StringUtil", function () {

  it('lpad works', function () {
    expect(StringUtil.lpad("xyz", 6)).toEqual("   xyz");
    expect(StringUtil.lpad("xyz", 3)).toEqual("xyz");
    expect(StringUtil.lpad("xyz", 2)).toEqual("xyz");
  });

  it('repeat works', function () {
    expect(StringUtil.repeat("xyz", 3)).toEqual("xyzxyzxyz");
    expect(StringUtil.repeat("xyz", 1)).toEqual("xyz");
    expect(StringUtil.repeat("xyz", 0)).toEqual("");
    expect(StringUtil.repeat("-", 15)).toEqual("---------------");
    expect(StringUtil.repeat("-", 16)).toEqual("----------------");
  });

  it('formatNumberFixedWidth works', function () {
    expect(StringUtil.formatNumberFixedWidth(5, 10)).toEqual("     5.000");
    expect(StringUtil.formatNumberFixedWidth(5, 10, 4)).toEqual("    5.0000");
    expect(StringUtil.formatNumberFixedWidth(50000, 10, 4)).toEqual("50000.0000");
    expect(StringUtil.formatNumberFixedWidth(9999.9999, 10, 4)).toEqual(" 9999.9999");
    expect(StringUtil.formatNumberFixedWidth(99999.9999, 10, 4)).toEqual("99999.9999");
    expect(StringUtil.formatNumberFixedWidth(-9999.9999, 10, 4)).toEqual("-9999.9999");
    expect(StringUtil.formatNumberFixedWidth(-99999.9999, 10, 4)).toEqual("-1.0000e+5");
    expect(StringUtil.formatNumberFixedWidth(100000, 10, 4)).toEqual(" 1.0000e+5");
    expect(StringUtil.formatNumberFixedWidth(-100000, 10, 4)).toEqual("-1.0000e+5");
  });

});

