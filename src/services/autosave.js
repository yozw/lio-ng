app.service('autosaveService', function (model, $interval, storageService) {
  "use strict";
  var lastSavedModel = {code: "", doc: ""};
  var AUTOSAVE_INTERVAL_MS = 5000;

  storageService.onModelLoaded(function (model) {
    lastSavedModel.code = model.code;
    lastSavedModel.doc = model.doc;
  });

  storageService.onModelSaved(function (model) {
    lastSavedModel.code = model.code;
    lastSavedModel.doc = model.doc;
  });

  function modelHasChanged() {
    return (model.code !== lastSavedModel.code)
        ||( model.doc !== lastSavedModel.doc);
  }

  function autoSave() {
    if (modelHasChanged()) {
      console.log("Model has changed. Autosaving.");
      storageService.saveModelToModelStorage(model);
    }
  }

  $interval(autoSave, AUTOSAVE_INTERVAL_MS);

  return {
    onBeforeUnload: function () {
      if (modelHasChanged()) {
        return 'You are about to leave the online linear optimization solver. '
            + 'If you leave without saving, your changes will be lost.';
      }
      return null;
    }
  }
});
