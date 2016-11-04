'use strict';

describe("storageService.parseModelUrl", function () {
  var storageService;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'ngMock', 'lio-ng']);
    storageService = $injector.get('storageService');
  });

  it('works correctly for a full url',
      function () {
        var url = "gdrive:1/2";
        var parsedUrl = storageService.parseModelUrl(url);
        expect(parsedUrl.scheme).toEqual("gdrive");
        expect(parsedUrl.location).toEqual("1/2");
      });

  it('works correctly for an empty url',
      function () {
        var url = "";
        var parsedUrl = storageService.parseModelUrl(url);
        expect(parsedUrl.scheme).toEqual("");
        expect(parsedUrl.location).toEqual("");
      });

  it('works correctly for a url with no location',
      function () {
        var url = "http:";
        var parsedUrl = storageService.parseModelUrl(url);
        expect(parsedUrl.scheme).toEqual("http");
        expect(parsedUrl.location).toEqual("");
      });

  it('works correctly for a url with no scheme',
      function () {
        var url = "12";
        var parsedUrl = storageService.parseModelUrl(url);
        expect(parsedUrl.scheme).toEqual("");
        expect(parsedUrl.location).toEqual("12");
      });
});

