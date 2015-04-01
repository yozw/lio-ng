function actionSolve(e) {
  var code = e.data.code;
  var result = GlpkUtil.solveGmpl(code);
  if (result === null) {
    return;
  }

  var lp = result.lp;

  postTable('overview', GlpkUtil.getOverviewTable(lp, result.statusMessage));

  switch (result.status) {
    case GlpkUtil.STATUS_INFEASIBLE:
    case GlpkUtil.STATUS_UNBOUNDED:
      if (glp_get_num_cols(lp) === 2) {
        postGraph('overview', FeasibleRegionGraph.create(lp));
      }
      return result.statusMessage;

    case GlpkUtil.STATUS_OPTIMAL:
      postTable('primal', GlpkUtil.getPrimalSolutionTable(lp));
      postTable('dual', GlpkUtil.getConstraintsTable(lp));
      if (glp_get_num_cols(lp) === 2) {
        postGraph('overview', FeasibleRegionGraph.create(lp));
      }
      return "An optimal solution was found.";

    case GlpkUtil.STATUS_ERROR:
      throw result.statusMessage;

    default:
      throw "Unknown status.";
  }
}
