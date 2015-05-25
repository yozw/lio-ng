var TableUtil = {};

TableUtil.extendOptions = function(options, args) {
  if (!args || args.trim().length == 0) {
    return options;
  }

  var parsedOptions;
  try {
    parsedOptions = jsonic(args.trim());
  } catch (e) {
    throw new Error("Cannot parse " + args + " " + e.message);
  }
  return extend(options, parsedOptions);
};

