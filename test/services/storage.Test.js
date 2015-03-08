'use strict';

describe("storageUtil.splitUrl", function () {
  var storageUtil;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    storageUtil = $injector.get('storageUtil');
  });

  it('works correctly for a full url',
      function () {
        var url = "gdrive:1/2";
        var splitUrl = storageUtil.splitUrl(url);
        expect(splitUrl.scheme).toEqual("gdrive");
        expect(splitUrl.location).toEqual("1/2");
      });

  it('works correctly for an empty url',
      function () {
        var url = "";
        var splitUrl = storageUtil.splitUrl(url);
        expect(splitUrl.scheme).toEqual("");
        expect(splitUrl.location).toEqual("");
      });

  it('works correctly for a url with no location',
      function () {
        var url = "http:";
        var splitUrl = storageUtil.splitUrl(url);
        expect(splitUrl.scheme).toEqual("http");
        expect(splitUrl.location).toEqual("");
      });

  it('works correctly for a url with no scheme',
      function () {
        var url = "12";
        var splitUrl = storageUtil.splitUrl(url);
        expect(splitUrl.scheme).toEqual("");
        expect(splitUrl.location).toEqual("12");
      });
});

describe("storageUtil.splitModel", function () {
  var storageUtil;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    storageUtil = $injector.get('storageUtil');
  });

  it('works correctly for model with doc',
      function () {
        var model = "## doc\n## doc2\n\n\nmodel";
        var splitModel = storageUtil.splitModel(model);
        expect(splitModel.help).toEqual(" doc\n doc2")
        expect(splitModel.code).toEqual("model")
      }
  );

  it('works correctly for model without doc',
      function () {
        var model = "\n\n\nmodel";
        var splitModel = storageUtil.splitModel(model);
        expect(splitModel.help).toEqual("");
        expect(splitModel.code).toEqual("model")
      }
  );

  it('does not interpret double hash tags as doc when the model code has started',
      function () {
        var model = "## doc\n\n\n\nmodel\n\n## model";
        var splitModel = storageUtil.splitModel(model);
        expect(splitModel.help).toEqual(" doc");
        expect(splitModel.code).toEqual("model\n\n## model");
      }
  );

});

describe("storageUtil.combineModel", function () {
  var storageUtil;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    storageUtil = $injector.get('storageUtil');
  });

  it('works correctly for model with doc',
      function () {
        var model = storageUtil.combineModel({code: "\n\n\nmodel", help: " doc\n doc2"});
        expect(model).toEqual("## doc\n## doc2\n\nmodel");
      }
  );

  it('works correctly for model without doc',
      function () {
        var model = storageUtil.combineModel({code: "\n\n\nmodel", help: ""});
        expect(model).toEqual("model");
      }
  );

  it('repeatedly splitting and combines is stable',
      function () {
        var model = "## doc\n## doc2\n\nmodel\n";
        var splitModel = storageUtil.splitModel(model);
        var newModel = storageUtil.combineModel(splitModel);
        expect(newModel).toEqual(model);
      }
  );

});
