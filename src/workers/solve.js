function actionSolve(e) {
  var code = e.data.code;
  var result = GlpkUtil.solveGmpl(code);
  if (result === null) {
    return;
  }

  if (result.status === GLP_ENOPFS) {
    return "The model is infeasible.";
  } else if (result.status === GLP_ENODFS) {
    return "The model is unbounded.";
  } else if (result.status != 0) {
    return "An error occurred while solving (status code = " + result.status + ")";
  }

  var lp = result.lp;
  var status = GlpkUtil.getModelStatus(lp);
  switch (status) {
    case GLP_OPT:
      postOutput("The optimal objective value is " + result.objectiveValue + ".");
      postTable(GlpkUtil.getPrimalSolutionTable(lp));
      if (glp_get_num_cols(lp) === 2) {
        postGraph(FeasibleRegionGraph.create(lp));
      }
      return "An optimal solution was found.";
    case GLP_NOFEAS:
    case GLP_UNDEF:
    case GLP_UNBND:
      return "The model is infeasible or unbounded.";
    case GLP_FEAS:
      throw new Error("GLPK solver returned GLP_FEAS");
    case GLP_INFEAS:
      throw new Error("GLPK solver returned GLP_INFEAS");
    default:
      throw new Error("GLPK solver returned undefined status (" + status + ")");
  }
}
