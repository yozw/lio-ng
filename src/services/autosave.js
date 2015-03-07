app.service('autosaveService', function (model, $interval, storageService) {
  "use strict";
  var lastSavedModel = {code: "", help: ""};

  storageService.onModelLoaded(function (model) {
    lastSavedModel.code = model.code;
    lastSavedModel.help = model.help;
  });

  storageService.onModelSaved(function (model) {
    lastSavedModel.code = model.code;
    lastSavedModel.help = model.help;
  });

  function modelHasChanged() {
    return (model.code !== lastSavedModel.code)
        ||( model.help !== lastSavedModel.help);
  }

  function autoSave() {
    if (modelHasChanged()) {
      console.log("Model has changed. Autosaving.");
      storageService.saveModelToModelStorage(model);
    }
  }

  $interval(autoSave, 1000);

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
