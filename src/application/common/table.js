"use strict";

// TODO: implement serialization/deserialization
// TODO: Write unit tests
var Table = function () {

  var columnKeyCounter = 0;

  /** Column class **/
  var Column = function (name) {
    var self = this;
    self.name = name;
    self.key = ++columnKeyCounter;

    self.serialize = function () {
      return {name: self.name};
    };
  };

  /** Row class **/
  var Row = function () {
    var self = this;

    self.values = {};

    self.setValue = function (column, value) {
      self.values[column.key] = value;
    };

    self.getValue = function (column) {
      return self.values[column.key];
    };
  };

  var columns = [];
  var rows = [];
  var self = this;
  self.options = {
    showHeader: true
  };

  this.addColumn = function (name) {
    var column = new Column(name);
    columns.push(column);
    return column;
  };

  this.getColumns = function() {
    return columns;
  };

  this.getColumnByName = function(name) {
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].name == name) {
        return columns[i];
      }
    }
    return null;
  };

  this.getRows = function() {
    return rows;
  };

  this.getRow = function(index) {
    return rows[index];
  };

  this.addRow = function () {
    var row = new Row();
    rows.push(row);
    return row;
  };

  this.serialize = function () {
    var c, r;
    var object = {};
    object.options = self.options;
    object.columns = [];
    object.rows = [];
    for (c = 0; c < columns.length; c++) {
      object.columns.push(columns[c].serialize());
    }
    for (r = 0; r < rows.length; r++) {
      var row = [];
      for (c = 0; c < columns.length; c++) {
        row.push(rows[r].getValue(columns[c]));
      }
      object.rows.push(row);
    }
    return object;
  };
};

