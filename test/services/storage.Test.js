'use strict';

describe("storageService.getSchemeAndLocation", function () {
  var storageService;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'ngMock', 'lio-ng']);
    storageService = $injector.get('storageService');
  });

  it('works correctly for a full url',
      function () {
        var url = "gdrive:1/2";
        var splitUrl = storageService.getSchemeAndLocation(url);
        expect(splitUrl.scheme).toEqual("gdrive");
        expect(splitUrl.location).toEqual("1/2");
      });

  it('works correctly for an empty url',
      function () {
        var url = "";
        var splitUrl = storageService.getSchemeAndLocation(url);
        expect(splitUrl.scheme).toEqual("");
        expect(splitUrl.location).toEqual("");
      });

  it('works correctly for a url with no location',
      function () {
        var url = "http:";
        var splitUrl = storageService.getSchemeAndLocation(url);
        expect(splitUrl.scheme).toEqual("http");
        expect(splitUrl.location).toEqual("");
      });

  it('works correctly for a url with no scheme',
      function () {
        var url = "12";
        var splitUrl = storageService.getSchemeAndLocation(url);
        expect(splitUrl.scheme).toEqual("");
        expect(splitUrl.location).toEqual("12");
      });
});

