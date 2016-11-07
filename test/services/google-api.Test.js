'use strict';

describe("googleApiService", function () {

  var googleApiService;
  var $rootScope;
  var gapiModules = [];
  var gapiClientModules = [];
  var authorized;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'ngMock', 'lio-ng']);
    googleApiService = $injector.get('googleApiService');
    $rootScope = $injector.get('$rootScope');
    gapiModules = [];
    gapiClientModules = [];
    authorized = false;

    window.gapi = {load: function(module, options) {
      setTimeout(function() {
        gapiModules.push(module);
        options.callback();
      }, 250);
    }};
    window.gapi.client = {load: function(module, version, callback) {
      setTimeout(function() {
        gapiClientModules.push(module);
        callback();
      }, 250);
    }};
    window.gapi.auth = {authorize: function(call, callback) {
      setTimeout(function() {
        var authResult = {access_token: "TOKEN"};
        authorized = true;
        callback(authResult);
      }, 750);
    }};
  });

  it("waits for auth API to be loaded before calling the callback function", function() {
    var callbackCalled = false;

    runs(function () {
      googleApiService.loadGoogleApis(["auth"])
          .then(function () {
            callbackCalled = true;
          })
          .catch(function (reason) {
            throw new Error(reason);
          });

      expect(gapiModules).toEqual([]);
      expect(gapiClientModules).toEqual([]);
      expect(authorized).toEqual(false);
      expect(callbackCalled).toEqual(false);
    });

    waitsFor(function() {
      $rootScope.$digest();
      return callbackCalled;
    }, 3000);

    runs(function() {
      expect(gapiModules).toEqual(["auth"]);
      expect(gapiClientModules).toEqual([]);
      expect(authorized).toEqual(true);
    });
  });

  it("waits for Picker API to be loaded before calling the callback function", function() {
    var callbackCalled = false;

    runs(function() {
      googleApiService.loadGoogleApis(["picker"])
          .then(function () {
            callbackCalled = true;
          })
          .catch(function (reason) {
            throw new Error(reason);
          });


      expect(gapiModules).toEqual([]);
      expect(gapiClientModules).toEqual([]);
      expect(authorized).toEqual(false);
      expect(callbackCalled).toEqual(false);
    });

    waitsFor(function() {
      $rootScope.$digest();
      return callbackCalled;
    }, 3000);

    runs(function() {
      expect(gapiModules).toEqual(["picker"]);
      expect(gapiClientModules).toEqual([]);
      expect(authorized).toEqual(false);
    });
  });

  it("waits for Auth and Drive API to be loaded before calling the callback function", function() {
    var callbackCalled = false;

    runs(function() {
      googleApiService.loadGoogleApis(["auth", "drive"])
          .then(function () {
            callbackCalled = true;
          })
          .catch(function (reason) {
            throw new Error(reason);
          });


      expect(gapiModules).toEqual([]);
      expect(gapiClientModules).toEqual([]);
      expect(authorized).toEqual(false);
      expect(callbackCalled).toEqual(false);
    });

    waitsFor(function() {
      $rootScope.$digest();
      return callbackCalled;
    }, 3000);

    runs(function() {
      expect(gapiModules).toEqual(["auth"]);
      expect(gapiClientModules).toEqual(["drive"]);
      expect(authorized).toEqual(true);
      expect(googleApiService.getOauthToken()).toEqual("TOKEN");
    });
  });

});