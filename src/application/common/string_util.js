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


/**
 * Returns a human-readable string representing how much time has elapsed
 * between two time points.
 *
 * @param startTime
 * @param endTime
 * @returns {string}
 */
StringUtil.timeDifferenceStr = function(startTime, endTime) {
  var delta_in_sec = Math.floor((endTime - startTime) / 1000);
  var delta_in_minutes = Math.floor(delta_in_sec / 60);
  var delta_in_hours = Math.floor(delta_in_sec / (60 * 60));
  var delta_in_days = Math.floor(delta_in_sec / (24 * 60 * 60));
  if (delta_in_minutes < 1) {
    return "just now";
  } else if (delta_in_minutes == 1) {
    return "1 minute ago";
  } else if (delta_in_minutes < 60) {
    return delta_in_minutes + " minutes ago";
  } else if (delta_in_hours == 1) {
    return "1 hour ago";
  } else if (delta_in_hours < 24) {
    return delta_in_hours + " hours ago";
  } else if (delta_in_days == 1) {
    return "1 day ago";
  } else {
    return delta_in_days + " days ago";
  }
};

/**
 * Constructs a new URL object from the given url string.
 *
 * @param urlString
 * @constructor
 */
StringUtil.URL = function(urlString) {
  this.href = urlString;
  var index = urlString.indexOf(":");
  if (index < 0) {
    this.protocol = "";
    this.path = urlString;
  } else {
    this.protocol = urlString.substring(0, index);
    this.path = urlString.substring(index + 1);
  }
};
