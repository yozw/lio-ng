'use strict';

describe("serializationService.deserializeModel", function () {
  var serializationService;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    serializationService = $injector.get('serializationService');
  });

  it('works correctly for model with doc',
      function () {
        var model = "/** doc\n doc2*/\n\n\nmodel";
        var splitModel = serializationService.deserializeModel(model);
        expect(splitModel.doc).toEqual(" doc\n doc2");
        expect(splitModel.code).toEqual("model\n");
      }
  );

  it('works correctly for model without doc',
      function () {
        var model = "\n\n\nmodel";
        var splitModel = serializationService.deserializeModel(model);
        expect(splitModel.doc).toEqual("");
        expect(splitModel.code).toEqual("model\n");
      }
  );

  it('does not interpret comments as doc when the model code has started',
      function () {
        var model = "/** doc */\n\n\n\nmodel\n\n/** model*/";
        var splitModel = serializationService.deserializeModel(model);
        expect(splitModel.doc).toEqual(" doc ");
        expect(splitModel.code).toEqual("model\n\n/** model*/\n");
      }
  );

});

describe("serializationService.serializeModel", function () {
  var serializationService;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    serializationService = $injector.get('serializationService');
  });

  it('works correctly for model with doc',
      function () {
        var model = serializationService.serializeModel({code: "\n\n\nmodel", doc: " doc\n doc2"});
        expect(model).toEqual("/** doc\n doc2*/\n\nmodel\n");
      }
  );

  it('works correctly for model without doc',
      function () {
        var model = serializationService.serializeModel({code: "\n\n\nmodel", doc: ""});
        expect(model).toEqual("model\n");
      }
  );

  it('repeatedly splitting and combines is stable',
      function () {
        var model = "/** doc\n doc2 */\n\nmodel\n";
        var splitModel = serializationService.deserializeModel(model);
        var newModel = serializationService.serializeModel(splitModel);
        expect(newModel).toEqual(model);
      }
  );

});
