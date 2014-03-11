importScripts('../../lib/glpk/glpk.js');

self.addEventListener('message', function (e) {
  "use strict"

  function log(value) {
    self.postMessage({action: 'log', message: value});
  }

  glp_set_print_func(log);

  var obj = e.data;
  switch (obj.action) {
    case 'load':
      var result = {};
      var objective;

      try {
        var workspace = glp_mpl_alloc_wksp();
        var lp = glp_create_prob();

        glp_mpl_read_model_from_string(workspace, 'Model', obj.data);

        glp_mpl_generate(workspace, null, null, null);

        glp_mpl_build_prob(workspace, lp);

        glp_scale_prob(lp, GLP_SF_AUTO);

        var smcp = new SMCP({presolve: GLP_ON});
        glp_simplex(lp, smcp);

        var i;

        if (obj.mip) {
          glp_intopt(lp);
          objective = glp_mip_obj_val(lp);
          for (i = 1; i <= glp_get_num_cols(lp); i++) {
            result[glp_get_col_name(lp, i)] = glp_mip_col_val(lp, i);
          }
        } else {
          objective = glp_get_obj_val(lp);
          for (i = 1; i <= glp_get_num_cols(lp); i++) {
            result[glp_get_col_name(lp, i)] = glp_get_col_prim(lp, i);
          }
        }

        lp = null;

      } catch (err) {
        log(err.message);
      } finally {
        self.postMessage({action: 'done', result: result, objective: objective});
      }
      break;
  }
}, false);

