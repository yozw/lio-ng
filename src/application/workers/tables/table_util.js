var TableUtil = {};

TableUtil.extendOptions = function(options, args) {
  if (!args || args.trim().length == 0) {
    return options;
  }

  var parsedOptions;
  try {
    parsedOptions = eval("(" + args + ")");
  } catch (e) {
    throw new Error(e.message);
  }
  return extend(options, parsedOptions);
};

