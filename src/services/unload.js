app.service('unloadService', function () {
  "use strict";
  var lastLoadedModel = {code: "", help: ""};
  var model = lastLoadedModel;

  return {
    onModelLoaded: function (loadedModel) {
      lastLoadedModel.code = loadedModel.code;
      lastLoadedModel.help = loadedModel.help;
      model = loadedModel;
    },
    onBeforeUnload: function () {
      if (model.code !== lastLoadedModel.code
          || model.help !== lastLoadedModel.help) {
        return 'You are about to leave the online linear optimization solver. '
            + 'If you leave without saving, your changes will be lost.';
      }
      return null;
    }
  }
});
