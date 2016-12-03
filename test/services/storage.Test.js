'use strict';

describe("storageService.readModel", function () {
  function catchPromise(promise) {
    var result = Object();
    result.resolved = false;
    promise
        .then(function (response) {
          result.response = response;
          result.resolved = true;
        })
        .catch(function (error) {
          result.error = error;
          result.resolved = true;
        });
    return result;
  }

  beforeEach(angular.mock.module('lio-ng'));

  beforeEach(function () {
    angular.mock.module(function ($provide) {
      // Create mock builtinStorageBackend.
      $provide.factory('builtinStorageBackend', function ($q) {
        return {
          getModelInfo: jasmine.createSpy('getModelInfo').andCallFake(function (urlString, dict) {
            dict = dict || {};
            dict.urlString = urlString;
            return $q.when(dict);
          }),
          load: jasmine.createSpy('load').andCallFake(function (url) {
            return $q.when('Builtin model: ' + url);
          })
        }
      });

      // Create mock gdriveStorageBackend.
      $provide.factory('gdriveStorageBackend', function ($q) {
        return {
          getModelInfo: jasmine.createSpy('getModelInfo').andCallFake(function (urlString, dict) {
            dict = dict || {};
            dict.urlString = urlString;
            return $q.when(dict);
          }),
          load: jasmine.createSpy('load').andCallFake(function (id) {
            return $q.when('Gdrive model: ' + id);
          }),
          save: jasmine.createSpy('save').andCallFake(function () {
            return $q.when('Saved');
          }),
          update: jasmine.createSpy('update').andCallFake(function () {
          })
        }
      });

      // Create mock modelStorageBackend.
      $provide.factory('modelStorageBackend', function ($q) {
        return {
          getModelInfo: jasmine.createSpy('getModelInfo').andCallFake(function (urlString, dict) {
            dict = dict || {};
            dict.urlString = urlString;
            return $q.when(dict);
          }),
          load: jasmine.createSpy('load').andCallFake(function (id) {
            return $q.when('Model storage model: ' + id);
          }),
          save: jasmine.createSpy('save').andCallFake(function () {
            return $q.when('Saved');
          })
        }
      });

      // Create mock webStorageBackend.
      $provide.factory('webStorageBackend', function ($q) {
        return {
          getModelInfo: jasmine.createSpy('getModelInfo').andCallFake(function (urlString, dict) {
            dict = dict || {};
            dict.urlString = urlString;
            return $q.when(dict);
          }),
          load: jasmine.createSpy('load').andCallFake(function (url) {
            return $q.when('Web model: ' + url);
          })
        }
      });
    });
  });

  it('Correctly loads a built-in model', inject(function ($rootScope, storageService, builtinStorageBackend) {
    var url = 'builtin:mymodel';

    storageService.readModel(url);
    $rootScope.$apply();

    expect(builtinStorageBackend.load).toHaveBeenCalledWith(url);
    expect(storageService.status.lastSaveTime).toBeNull();
  }));

  it('Correctly retrieves info for a built-in model', inject(function ($rootScope, storageService,
                                                                       builtinStorageBackend) {
    var urlString = 'builtin:mymodel';
    var info = catchPromise(storageService.getModelInfo(urlString));
    $rootScope.$apply();

    expect(info.response.urlString).toEqual(urlString);
    expect(builtinStorageBackend.getModelInfo).toHaveBeenCalledWith(urlString);
  }));

  it('Correctly loads a Google Drive model', inject(function ($rootScope, storageService, builtinStorageBackend,
                                                              modelStorageBackend, gdriveStorageBackend,
                                                              webStorageBackend) {
    var url = 'gdrive:1234';
    storageService.readModel(url);
    $rootScope.$apply();

    expect(gdriveStorageBackend.load).toHaveBeenCalledWith(url);
    expect(storageService.status.lastSaveTime).toBeNull();

    expect(modelStorageBackend.load).not.toHaveBeenCalled();
    expect(modelStorageBackend.save).not.toHaveBeenCalled();
    expect(gdriveStorageBackend.save).not.toHaveBeenCalled();
    expect(webStorageBackend.load).not.toHaveBeenCalled();
  }));

  it('Correctly retrieves info for a Google Drive model', inject(function ($rootScope, storageService, gdriveStorageBackend) {
    var urlString = 'gdrive:1234';
    var info = catchPromise(storageService.getModelInfo(urlString));
    $rootScope.$apply();

    expect(info.response.urlString).toEqual(urlString);
    expect(gdriveStorageBackend.getModelInfo).toHaveBeenCalledWith(urlString);
  }));

  it('Correctly saves a Google Drive model', inject(function ($rootScope, storageService, builtinStorageBackend,
                                                              modelStorageBackend, gdriveStorageBackend,
                                                              webStorageBackend) {
    var model = {code: 'code', doc: 'doc'};
    expect(storageService.status.lastSaveTime).toBeNull();
    storageService.saveModelToGoogleDrive('model.mod', model, 'parent');
    $rootScope.$apply();

    expect(gdriveStorageBackend.save).toHaveBeenCalledWith('/**doc*/\n\ncode\n', 'model.mod', 'parent');
    expect(storageService.status.lastSaveTime).not.toBeNull();

    expect(modelStorageBackend.load).not.toHaveBeenCalled();
    expect(modelStorageBackend.save).not.toHaveBeenCalled();
    expect(gdriveStorageBackend.load).not.toHaveBeenCalled();
    expect(webStorageBackend.load).not.toHaveBeenCalled();
  }));

  it('Correctly loads a model storage model', inject(function ($rootScope, storageService, modelStorageBackend) {
    storageService.readModel('ms:1234');
    $rootScope.$apply();

    expect(modelStorageBackend.load).toHaveBeenCalledWith('ms:1234');
    expect(storageService.status.lastSaveTime).toBeNull();
  }));

  it('Correctly retrieves info for a storage model', inject(function ($rootScope, storageService, modelStorageBackend) {
    var urlString = 'ms:1234';
    var info = catchPromise(storageService.getModelInfo(urlString));
    $rootScope.$apply();

    expect(info.response.urlString).toEqual(urlString);
    expect(modelStorageBackend.getModelInfo).toHaveBeenCalledWith(urlString);
  }));

  it('Correctly loads a web model', inject(function ($rootScope, storageService, webStorageBackend) {
    storageService.readModel('http://url');
    $rootScope.$apply();

    expect(webStorageBackend.load).toHaveBeenCalledWith('http://url');
    expect(storageService.status.lastSaveTime).toBeNull();
  }));

  it('Correctly retrieves info for a web model', inject(function ($rootScope, storageService, webStorageBackend) {
    var urlString = 'http://url/filename.txt';
    var info = catchPromise(storageService.getModelInfo(urlString));
    $rootScope.$apply();

    expect(info.response.urlString).toEqual(urlString);
    expect(webStorageBackend.getModelInfo).toHaveBeenCalledWith(urlString);
  }));
});
