function actionSolve(e) {
  var code = e.data.code;
  var result = GlpkUtil.solveGmpl(code);
  if (result === null) {
    return;
  }

  if (result.status === "infeasible") {
    return "The model is infeasible.";
  } else if (result.status === "unbounded") {
    return "The model is unbounded.";
  } else if (result.status === "optimal") {
    var lp = result.lp;
    postOutput("The optimal objective value is " + result.objectiveValue + ".");
    postTable(GlpkUtil.getPrimalSolutionTable(lp));
    if (glp_get_num_cols(lp) === 2) {
      postGraph(FeasibleRegionGraph.create(lp));
    }
    return "An optimal solution was found.";
  } else {
    return "An error occurred while solving (status = " + result.status + ")";
  }
}
