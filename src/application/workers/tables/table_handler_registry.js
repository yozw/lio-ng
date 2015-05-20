// Registry for several different table handlers

function TableHandlerRegistry() {
  this.drivers = [];
}

TableHandlerRegistry.prototype.install = function (handler) {
  if (handler.name === undefined) {
    throw new Error("Table handler has no name.");
  }
  if (this.drivers[handler.name] !== undefined) {
    throw new Error("Table handler with name " + handler.name + " is already installed.");
  }
  this.drivers[handler.name] = handler;
  mpl_tab_drv_register(handler.name, TableDriver);
};

TableHandlerRegistry.prototype.getCallback = function () {
  var drivers = this.drivers;

  return function (arg, mode, data) {
    var name = arg[1];
    var handler = drivers[name];
    if (!handler) {
      throw new Error("Invalid table driver: " + name + ". Valid driver names are: "
          + driverNames.join(", "));
    }

    switch (mode) {
      case "R":
        if (!handler.read) {
          throw new Error("Table driver '" + name + "' does not support reading.");
        }
        return handler.read(arg, data);
      case "W":
        if (!handler.write) {
          throw new Error("Table driver '" + name + "' does not support writing.");
        }
        return handler.write(arg, data);
      default:
        throw new Error("TableDriverRegistry: iIllegal read/write mode: " + mode + ".")
    }
  }
};
