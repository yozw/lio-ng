var StringUtil = {};

/**
 * Pads the given string with spaces on the left until the string has the given length.
 * @param str {string}
 * @param width {Number}
 * @returns {string}
 */
StringUtil.lpad = function(str, width) {
  return StringUtil.repeat(" ", width - str.length) + str;
};

/**
 * Concatenates a given number of copies of the given string.
 * @param str {string}
 * @param times {Number}
 * @returns {string}
 */
StringUtil.repeat = function (str, times) {
  var result = "";
  while (times > 0) {
    if (times % 2 == 1) {
      result += str;
    }
    times >>= 1;
    if (times > 0) {
      str += str;
    }
  }
  return result;
};

/**
 * Formats the given number in a human-readable form so that the output has the
 * requested width.
 * @param x {Number}
 * @param width {Number}
 * @param [decimals] {Number}
 * @returns {string}
 */
StringUtil.formatNumberFixedWidth = function(x, width, decimals) {
  if (!decimals) {
    decimals = 3;
  }

  if (x < Math.pow(10, width - 5) && x > -Math.pow(10, width - 6)) {
    return StringUtil.lpad(x.toFixed(decimals), width);
  } else {
    return StringUtil.lpad(x.toExponential(decimals), width)
  }
};
