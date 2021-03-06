'use strict';

describe("builtinStorageBackend", function () {

  var backend;
  var $httpBackend;
  var $rootScope;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'ngMock', 'lio-ng']);
    backend = $injector.get('builtinStorageBackend');
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

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


  it("correctly loads a builtin model", function () {
    var result = catchPromise(backend.load('builtin:test.mod'));

    $httpBackend.expectGET('/models/test.mod').respond(200, 'data');
    $httpBackend.flush();

    expect(result.response).toEqual('data');
    expect(result.error).toEqual(undefined);
  });

  it("correctly fails on a non-existing model", function () {
    var result = catchPromise(backend.load('builtin:test.mod'));

    $httpBackend.expectGET('/models/test.mod').respond(404);
    $httpBackend.flush();

    expect(result.response).toEqual(undefined);
    expect(result.error).toEqual('Model not found');
  });

  it("correctly fails with a 403 error", function () {
    var result = catchPromise(backend.load('builtin:test.mod'));

    $httpBackend.expectGET('/models/test.mod').respond(403);
    $httpBackend.flush();

    expect(result.response).toEqual(undefined);
    expect(result.error).toEqual('Could not load model (HTTP response 403)');
  });

  it("correctly gets model information", function () {
    var dict = {file: 'bla.mod'};
    backend.getModelInfo('model/test.mod', dict);
    expect(dict.file).toEqual('bla.mod');
    expect(dict.name).toEqual('test.mod');
  })
});
