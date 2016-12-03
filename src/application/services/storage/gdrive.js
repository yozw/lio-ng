// TODO: Write unit tests
app.service('gdriveStorageBackend', function ($q, $log, googleDriveService) {
  "use strict";

  function augmentWithParentInfo(info) {
    if (!info || !info.parents || !info.parents[0]) {
      return $q.when(info);
    }

    if (info.parents[0].isRoot) {
      info.parents[0].title = 'My Drive';
      return $q.when(info);
    }

    return googleDriveService.getFileInfo(info.parents[0].id)
        .then(function (parentInfo) {
          info.parents[0].title = parentInfo.title;
          return info;
        })
  }

  function getModelInfo(urlString, dict) {
    var url = new StringUtil.URL(urlString);
    var fileId = url.path;
    if (dict === undefined) dict = {};
    var defer = $q.defer();
    dict.fileId = fileId;
    googleDriveService.getFileInfo(fileId)
        .then(augmentWithParentInfo)
        .then(function (info) {
          dict.name = info.title;
          dict.info = info;
          defer.resolve(dict);
        });
    return defer.promise;
  }

  function save(contents, title, parent) {
    return googleDriveService.insertFile(contents, title, parent)
        .then(function (fileId) {
          return $q.when('gdrive:' + fileId);
        });
  }

  function update(contents, fileId) {
    return googleDriveService.updateFile(contents, fileId)
        .then(function (fileId) {
          return $q.when('gdrive:' + fileId);
        });
  }

  function load(urlString) {
    var url = new StringUtil.URL(urlString);
    var fileId = url.path;
    $log.info("Loading model from Google Drive: " + fileId);
    return googleDriveService.loadFile(fileId);
  }

  return {
    getModelInfo: getModelInfo,
    load: load,
    save: save,
    update: update
  }
});

