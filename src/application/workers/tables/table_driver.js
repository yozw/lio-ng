// Default GLPK table driver used by the TableDriverRegistry.

function TableDriver(dca, mode, callback) {
  this.mode = mode;
  this.fileName = mpl_tab_get_arg(dca, 2);

  if (mode === 'R') {
    this.ref = {};
    if (callback) {
      this.data = callback(dca.arg, mode);
      if (typeof this.data === 'string') {
        this.data = JSON.parse(this.data);
      }
      this.cursor = 1;
    } else {
      throw new Error("TableDriver: Unable to open " + this.fileName);
    }

    for (var i = 0, meta = this.data[0]; i < meta.length; i++) {
      this.ref[meta[i]] = i;
    }
  } else if (mode === 'W') {
    this.callback = callback;
    var names = [];
    this.data = [names];
    var numFields = mpl_tab_num_flds(dca);
    for (var k = 1; k <= numFields; k++) {
      names.push(mpl_tab_get_name(dca, k));
    }
  } else {
    throw new Error("TableDriver: Invalid mode: " + mode);
  }
}

TableDriver.prototype.writeRecord = function (dca) {
  if (this.mode !== 'W') {
    throw new Error("TableDriver: Driver should be in WRITE mode");
  }

  var numFields = mpl_tab_num_flds(dca);
  var line = [];
  for (var k = 1; k <= numFields; k++) {
    var valueType = mpl_tab_get_type(dca, k);
    switch (valueType) {
      case 'N':
        line.push(mpl_tab_get_num(dca, k));
        break;
      case 'S':
        line.push(mpl_tab_get_str(dca, k));
        break;
      default:
        throw new Error("TableDriver: Invalid type " + valueType);
    }
  }
  this.data.push(line);
  return 0;
};

TableDriver.prototype.readRecord = function (dca) {
  if (this.mode !== 'R') {
    throw new Error("TableDriver: Driver should be in READ mode");
  }

  /* read fields */
  var line = this.data[this.cursor++];
  if (line === null) {
    return XEOF;
  }

  var numFields = mpl_tab_num_flds(dca);
  for (var k = 1; k <= numFields; k++) {
    var index = this.ref[mpl_tab_get_name(dca, k)];
    if (index !== null) {
      var value = line[index];
      switch (typeof value) {
        case 'number':
          mpl_tab_set_num(dca, k, value);
          break;
        case 'boolean':
          mpl_tab_set_num(dca, k, Number(value));
          break;
        case 'string':
          mpl_tab_set_str(dca, k, value);
          break;
        default:
          throw new Error("TableDriver: Unexpected data type " + value + " in " + this.fileName);
      }
    }
  }
  return 0;
};

TableDriver.prototype.flush = function (dca) {
  this.callback(mpl_tab_get_args(dca), this.mode, this.data);
};
