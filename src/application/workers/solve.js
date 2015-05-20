/**
 * Async worker that loads the passed-in model and solves it.
 *
 * The worker emits (i.e., sends back to the main thread) an overview table giving an overview of the type of problem,
 * the number of variables and constraints, etc.
 *
 * Depending on whether an optimal solution was found, tables with the found primal/dual solutions are emitted.
 *
 * If the model is two-dimensional, a graph of the feasible region is emitted.
 *
 * @param e
 * @returns {*}
 */
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
      if (glp_get_num_cols(lp) > 0) {
        postTable('primal', GlpkUtil.getPrimalSolutionTable(lp));
      }
      if (glp_get_num_rows(lp) > 0) {
        postTable('dual', GlpkUtil.getConstraintsTable(lp));
      }
      if (glp_get_num_cols(lp) === 2) {
        postGraph('overview', FeasibleRegionGraph.create(lp));
      }
      return "An optimal solution was found.";

    case GlpkUtil.STATUS_ERROR:
      throw new Error(result.statusMessage);

    default:
      throw new Error("Unknown status.");
  }
}
