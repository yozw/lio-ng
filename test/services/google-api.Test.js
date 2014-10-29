'use strict';

describe("googleApiService", function () {

  var googleApiService;
  var gapiModules = [];
  var gapiClientModules = [];
  var authorized;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    googleApiService = $injector.get('googleApiService');
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

    runs(function() {
      googleApiService.loadGoogleApisAndCall(["auth"], function() {
        callbackCalled = true;
      });

      expect(gapiModules).toEqual([]);
      expect(gapiClientModules).toEqual([]);
      expect(authorized).toEqual(false);
      expect(callbackCalled).toEqual(false);
    });

    waitsFor(function() {
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
      googleApiService.loadGoogleApisAndCall(["picker"], function() {
        callbackCalled = true;
      });

      expect(gapiModules).toEqual([]);
      expect(gapiClientModules).toEqual([]);
      expect(authorized).toEqual(false);
      expect(callbackCalled).toEqual(false);
    });

    waitsFor(function() {
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
      googleApiService.loadGoogleApisAndCall(["auth", "drive"], function() {
        callbackCalled = true;
      });

      expect(gapiModules).toEqual([]);
      expect(gapiClientModules).toEqual([]);
      expect(authorized).toEqual(false);
      expect(callbackCalled).toEqual(false);
    });

    waitsFor(function() {
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