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

  it('timeDifferenceStr works', function () {
    var now = new Date().getTime();
    var sec = 1000;
    var minute = 60 * sec;
    var hour = 60 * minute;
    var day = 24 * hour;
    expect(StringUtil.timeDifferenceStr(now, now + sec)).toEqual("just now");
    expect(StringUtil.timeDifferenceStr(now, now + 59 * sec)).toEqual("just now");
    expect(StringUtil.timeDifferenceStr(now, now + minute)).toEqual("1 minute ago");
    expect(StringUtil.timeDifferenceStr(now, now + 2 * minute)).toEqual("2 minutes ago");
    expect(StringUtil.timeDifferenceStr(now, now + 59 * minute)).toEqual("59 minutes ago");
    expect(StringUtil.timeDifferenceStr(now, now + hour)).toEqual("1 hour ago");
    expect(StringUtil.timeDifferenceStr(now, now + 23 * hour)).toEqual("23 hours ago");
    expect(StringUtil.timeDifferenceStr(now, now + day)).toEqual("1 day ago");
    expect(StringUtil.timeDifferenceStr(now, now + 23 * day)).toEqual("23 days ago");
  });
});

describe("URL works", function () {
  it('works correctly for a full url', function () {
    var urlString = "gdrive:1/2";
    var url = new StringUtil.URL(urlString);
    expect(url.protocol).toEqual("gdrive");
    expect(url.path).toEqual("1/2");
  });

  it('works correctly for an empty url', function () {
    var urlString = "";
    var url = new StringUtil.URL(urlString);
    expect(url.protocol).toEqual("");
    expect(url.path).toEqual("");
  });

  it('works correctly for a url with no path', function () {
    var urlString = "http:";
    var url = new StringUtil.URL(urlString);
    expect(url.protocol).toEqual("http");
    expect(url.path).toEqual("");
  });

  it('works correctly for a url with no protocol', function () {
    var urlString = "12";
    var url = new StringUtil.URL(urlString);
    expect(url.protocol).toEqual("");
    expect(url.path).toEqual("12");
  });
});
