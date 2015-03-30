"use strict";

var GlpkUtil = Object();

//-----------------------------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------------------------

GlpkUtil.MODEL_NAME = "editor.mod";
GlpkUtil.ERROR_MSG_RE = new RegExp(GlpkUtil.MODEL_NAME.replace(".", "\\.") + ":([0-9]+):(.*)");

GlpkUtil.GLP_COL_KIND = {};
GlpkUtil.GLP_COL_KIND[GLP_CV] = 'Real';
GlpkUtil.GLP_COL_KIND[GLP_IV] = 'Integer';
GlpkUtil.GLP_COL_KIND[GLP_BV] = 'Binary';

GlpkUtil.GLP_COL_STATUS = {};
GlpkUtil.GLP_COL_STATUS[GLP_BS] = 'Basic';
GlpkUtil.GLP_COL_STATUS[GLP_NL] = 'At lower bound';
GlpkUtil.GLP_COL_STATUS[GLP_NU] = 'At upper bound';
GlpkUtil.GLP_COL_STATUS[GLP_NF] = 'Free';
GlpkUtil.GLP_COL_STATUS[GLP_NS] = 'Fixed';

GlpkUtil.GLP_ROW_STATUS = {};
GlpkUtil.GLP_ROW_STATUS[GLP_BS] = 'Basic';
GlpkUtil.GLP_ROW_STATUS[GLP_NL] = 'At lower bound';
GlpkUtil.GLP_ROW_STATUS[GLP_NU] = 'At upper bound';
GlpkUtil.GLP_ROW_STATUS[GLP_NF] = 'Free';
GlpkUtil.GLP_ROW_STATUS[GLP_NS] = 'Fixed';


//-----------------------------------------------------------------------------
// LOGGING FUNCTIONS
//-----------------------------------------------------------------------------

GlpkUtil._logOutputFunction = function(message) {};
GlpkUtil._logInfoFunction = function(message) {};
GlpkUtil._logErrorFunction = function(message, data) {
  GlpkUtil._logInfoFunction(message);
};

GlpkUtil.setOutputLogFunction = function(logOutputFn) {
  GlpkUtil._logOutputFunction = logOutputFn;
};

GlpkUtil.setInfoLogFunction = function(logInfoFn) {
  GlpkUtil._logInfoFunction = logInfoFn;
};

GlpkUtil.setErrorLogFunction = function(logErrorFn) {
  GlpkUtil._logErrorFunction = logErrorFn;
};

GlpkUtil.installLogFunction = function() {
  glp_set_print_func(GlpkUtil.info);
};

GlpkUtil.output = function(message) {
  GlpkUtil._logOutputFunction(message);
};

GlpkUtil.info = function(message) {
  GlpkUtil._logInfoFunction(message);
};

GlpkUtil.error = function(error) {
  "use strict";
  var message;

  if (error.hasOwnProperty('message')) {
    message = error.message;
  } else {
    message = error;
  }

  if (error.hasOwnProperty('line')) {
    var match = GlpkUtil.ERROR_MSG_RE.exec(error.message);
    if (match !== undefined && match.length >= 3) {
      message = "Error in line " + match[1] + ": " + match[2].trim();
    }
  }
  GlpkUtil._logErrorFunction(message, error);
};


//-----------------------------------------------------------------------------
// GLPK MODEL FUNCTIONS
//-----------------------------------------------------------------------------

/**
 * Returns the objective vector of a GLPK lp model.
 * @param lp
 * @returns {Array}
 */
// TODO: Write unit test
GlpkUtil.getObjectiveVector = function (lp) {
  "use strict";
  var vector = [];
  for (var j = 1; j <= glp_get_num_cols(lp); j++) {
    vector.push(glp_get_obj_coef(lp, j));
  }
  return vector;
};

/**
 * Returns the optimal objective value of the lp, if it makes sense.
 * @param lp
 * @returns {Number}
 */
// TODO: Write unit test
GlpkUtil.getObjectiveValue = function (lp) {
  return GlpkUtil.isMip(lp) ? glp_mip_obj_val(lp) : glp_get_obj_val(lp)
};

GlpkUtil.getModelStatus = function(lp) {
  return glp_get_status(lp);
};

/**
 * Determines whether the given model has integer variables.
 * @param lp
 * @returns {boolean} true if the model has at least one integer variable.
 */
GlpkUtil.isMip = function(lp) {
  return glp_get_num_int(lp) + glp_get_num_bin(lp) > 0;
};

/**
 * Returns a string describing the type of problem.
 * @param lp
 * @returns {String}
 */
// TODO: write unit test
GlpkUtil.getProblemType = function(lp) {
  "use strict";
  var numBinary = glp_get_num_bin(lp);
  var numInteger = glp_get_num_int(lp) - numBinary;
  var numContinous = glp_get_num_cols(lp) - numInteger - numBinary;
  var numVariables = numContinous + numInteger + numBinary;

  var problemType = glp_get_obj_name(lp) ? 'Optimization' : 'Feasibility';
  if (numVariables == 0) {
    return 'Empty';
  } else if (numBinary + numInteger == 0) {
    return 'Linear ' + problemType;
  } else if (numContinous + numInteger == 0) {
    return '0-1 ' + problemType;
  } else if (numContinous == 0) {
    return 'Integer ' + problemType;
  } else if (numInteger == 0) {
    return 'Mixed 0-1 ' + problemType;
  } else {
    return 'Mixed Integer ' + problemType;
  }
};

/**
 * Returns a row of the technology matrix of a GLPK lp model.
 * @param lp
 * @param i
 * @returns {*}
 */
// TODO: Write unit test
GlpkUtil.getRow = function (lp, i) {
  "use strict";
  var m = glp_get_num_cols(lp);
  var row = MathUtil.zeroes(m);
  var ind = [];
  var val = [];
  var length = glp_get_mat_row(lp, i, ind, val);
  for (var k = 1; k <= length; k++) {
    row[ind[k] - 1] = val[k];
  }
  return row;
};

/**
 * Gets all constraints for the specified Glpk lp object
 * @param lp
 * @returns {{matrix: Array, rhs: Array}}
 */
GlpkUtil.getConstraints = function (lp) {
  "use strict";
  var lb, ub, row;

  var matrix = [];
  var rhs = [];
  var n = glp_get_num_rows(lp);
  var m = glp_get_num_cols(lp);

  // Get variable bounds
  for (var i = 1; i <= m; i++) {
    lb = glp_get_col_lb(lp, i);
    ub = glp_get_col_ub(lp, i);
    if (MathUtil.isFinite(lb)) {
      row = MathUtil.zeroes(m);
      row[i - 1] = -1;
      matrix.push(row);
      rhs.push(-lb);
    }
    if (ub != Number.MAX_VALUE) {
      row = MathUtil.zeroes(m);
      row[i - 1] = 1;
      matrix.push(row);
      rhs.push(ub);
    }
  }

  // Get technology constraints
  for (var j = 1; j <= n; j++) {
    row = GlpkUtil.getRow(lp, j);
    lb = glp_get_row_lb(lp, j);
    ub = glp_get_row_ub(lp, j);
    if (lb != -Number.MAX_VALUE) {
      matrix.push(MathUtil.multiplyVector(row, -1));
      rhs.push(-lb);
    }
    if (ub != Number.MAX_VALUE) {
      matrix.push(row);
      rhs.push(ub);
    }
  }
  return {matrix: matrix, rhs: rhs};
};

/**
 * Solves a GNU MathProg model and returns a Glpk lp object.
 * @param code
 * @returns {Object} lp-model
 */
GlpkUtil.solveGmpl = function (code) {
  "use strict";
  var workspace = glp_mpl_alloc_wksp();
  var lp = glp_create_prob();

  GlpkUtil.installLogFunction();

  function getSolverStatus(glpStatus, lp) {
    var isMinimizing;

    if (glp_get_obj_dir(lp) == GLP_MIN) {
      isMinimizing = true;
    } else if (glp_get_obj_dir(lp) == GLP_MAX) {
      isMinimizing = false;
    } else {
      throw "Invalid optimization direction";
    }

    var status;
    var objectiveValue;

    switch (glpStatus) {
      case GLP_ENOPFS:
        status = "infeasible";
        objectiveValue = isMinimizing ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        break;
      case GLP_ENODFS:
        status = "unbounded";
        objectiveValue = isMinimizing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
        break;
      case 0:
        status = "optimal";
        objectiveValue = GlpkUtil.getObjectiveValue(lp);
        break;
      case GLP_EBADB:
        throw "Invalid basis.";
      case GLP_ESING:
        throw "Singular matrix.";
      case GLP_ECOND:
        throw "Ill-conditioned matrix.";
      case GLP_EBOUND:
        throw "The model contains one or more variables with invalid bounds.";
      case GLP_EFAIL:
        throw "Solver failed";
      case GLP_EOBJLL:
        throw "Objective lower limit reached.";
      case GLP_EOBJUL:
        throw "Objective upper limit reached.";
      case GLP_EITLIM:
        throw "Iteration limit exceeded.";
      case GLP_ETMLIM:
        throw "Time limit exceeded.";
      case GLP_EROOT:
        throw "Root LP optimum not provided.";
      case GLP_ESTOP:
        throw "Search terminated by application.";
      case GLP_EMIPGAP:
        throw "Search terminated by application.";
      case GLP_ENOFEAS:
        throw "No primal/dual feasible solution.";
      case GLP_ENOCVG:
        throw "No convergence.";
      case GLP_EINSTAB:
        throw "Numerical instability.";
      case GLP_EDATA:
        throw "Invalid data.";
      case GLP_ERANGE:
        throw "Result out of range.";
      default:
        throw "Simplex algorithm returned unknown status (" + glpStatus + ")";
    }

    return {lp: lp, status: status, objectiveValue: objectiveValue};
  }

  try {
    glp_mpl_read_model_from_string(workspace, GlpkUtil.MODEL_NAME, code);
    glp_mpl_generate(workspace, GlpkUtil.MODEL_NAME, GlpkUtil.output, null);
    glp_mpl_build_prob(workspace, lp);
    glp_scale_prob(lp, GLP_SF_AUTO);

    var info;
    if (!GlpkUtil.isMip(lp)) {
      GlpkUtil.info("Solving the model using the simplex optimizer");
      var smcp = new SMCP({presolve: GLP_ON});
      var simplexStatus = glp_simplex(lp, smcp);
      info = getSolverStatus(simplexStatus, lp);
      glp_mpl_postsolve(workspace, lp, GLP_SOL);
    } else {
      GlpkUtil.info("The model has integer variables: solving the model using the mixed-integer optimizer");
      var iocp = new IOCP({presolve: GLP_ON});
      var intOptStatus = glp_intopt(lp, iocp);
      info = getSolverStatus(intOptStatus, lp);
      glp_mpl_postsolve(workspace, lp, GLP_MIP);
    }
    return info;
  } catch (error) {
    GlpkUtil.error(error);
    return null;
  }
};


//-----------------------------------------------------------------------------
// GLPK MODEL OUTPUT FUNCTIONS
//-----------------------------------------------------------------------------

/**
 * Constructs a solution table for the specified lp object.
 * @param lp
 * @returns {Table}
 */
GlpkUtil.getOverviewTable = function (lp) {
  "use strict";
  var numBinary = glp_get_num_bin(lp);
  var numInteger = glp_get_num_int(lp) - numBinary;
  var numContinous = glp_get_num_cols(lp) - numInteger - numBinary;
  var numVariables = numContinous + numInteger + numBinary;

  var table = new Table();
  var labelColumn = table.addColumn("Label");
  var valueColumn = table.addColumn("Value");
  var row = table.addRow();
  row.setValue(labelColumn, "Problem type");
  row.setValue(valueColumn, GlpkUtil.getProblemType(lp));

  if (glp_get_obj_name(lp)) {
    var direction = glp_get_obj_dir(lp) == GLP_MIN ? 'Minimize' : 'Maximize';
    row = table.addRow();
    row.setValue(labelColumn, "Objective");
    row.setValue(valueColumn, direction + ' ' + glp_get_obj_name(lp));
  }

  row = table.addRow();
  row.setValue(labelColumn, "Optimal objective value");
  row.setValue(valueColumn,  GlpkUtil.getObjectiveValue(lp));

  row = table.addRow();
  row.setValue(labelColumn, "Total number of variables");
  row.setValue(valueColumn, numVariables);

  if (numContinous > 0) {
    row = table.addRow();
    row.setValue(labelColumn, "Continuous variables");
    row.setValue(valueColumn, numContinous);
  }

  if (numBinary > 0) {
    row = table.addRow();
    row.setValue(labelColumn, "Binary variables");
    row.setValue(valueColumn, numBinary);
  }

  if (numInteger > 0) {
    row = table.addRow();
    row.setValue(labelColumn, "Non-binary integer variables");
    row.setValue(valueColumn, numInteger);
  }

  row = table.addRow();
  row.setValue(labelColumn, "Number of constraints");
  row.setValue(valueColumn, glp_get_num_rows(lp));

  row = table.addRow();
  row.setValue(labelColumn, "Non-binary nonzero coefficients");
  row.setValue(valueColumn, glp_get_num_nz(lp));

  table.options.showHeader = false;
  return table;
};

/**
 * Constructs a primal solution table for the specified lp object.
 * @param lp
 * @returns {Table}
 */
GlpkUtil.getPrimalSolutionTable = function (lp) {
  "use strict";
  var table = new Table();

  var isMip = GlpkUtil.isMip(lp);

  var varNameColumn = table.addColumn("Variable");
  var valueColumn = table.addColumn("Value");
  var kindColumn = table.addColumn("Type");
  var statusColumn = table.addColumn("Status");

  var lbColumn = table.addColumn("Lower bound");
  var ubColumn = table.addColumn("Upper bound");

  var dualColumn;
  if (!isMip) {
    dualColumn = table.addColumn("Sensitivity");
  }

  for (var c = 1; c <= glp_get_num_cols(lp); c++) {
    var row = table.addRow();
    row.setValue(varNameColumn, glp_get_col_name(lp, c));
    row.setValue(valueColumn, isMip ? glp_mip_col_val(lp, c) : glp_get_col_prim(lp, c));
    var kind = glp_get_col_kind(lp, c);
    row.setValue(kindColumn, GlpkUtil.GLP_COL_KIND[kind]);
    var colStatus = glp_get_col_stat(lp, c);
    row.setValue(statusColumn, GlpkUtil.GLP_COL_STATUS[colStatus]);
    row.setValue(lbColumn, glp_get_col_lb(lp, c));
    row.setValue(ubColumn, glp_get_col_ub(lp, c));
    if (!isMip) {
      row.setValue(dualColumn, glp_get_col_dual(lp, c));
    }
  }

  return table;
};

/**
 * Constructs a solution table for the specified lp object.
 * @param lp
 * @returns {Table}
 */
GlpkUtil.getConstraintsTable = function (lp) {
  "use strict";
  var table = new Table();

  var varNameColumn = table.addColumn("Name");
  var valueColumn = table.addColumn("Rhs value");
  var statusColumn = table.addColumn("Status");
  var lbColumn = table.addColumn("Lower bound");
  var ubColumn = table.addColumn("Upper bound");

  var isMip = GlpkUtil.isMip(lp);

  for (var r = 1; r <= glp_get_num_rows(lp); r++) {
    var row = table.addRow();
    row.setValue(varNameColumn, glp_get_row_name(lp, r));
    row.setValue(valueColumn, isMip ? glp_mip_row_val(lp, r) : glp_get_row_prim(lp, r));

    var rowStatus = glp_get_row_stat(lp, r);
    row.setValue(statusColumn, GlpkUtil.GLP_ROW_STATUS[rowStatus]);
    row.setValue(lbColumn, glp_get_row_lb(lp, r));
    row.setValue(ubColumn, glp_get_row_ub(lp, r));
  }

  return table;
};
