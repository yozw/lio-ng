'use strict';

describe("messageService", function () {

  var messageService;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    messageService = $injector.get('messageService');
  });

  it('should set and get the message',
      function () {
        messageService.set('hello');
        expect(messageService.get()).toEqual('hello');
      });

  it('should clear the message',
      function () {
        messageService.set('hello');
        messageService.clear();
        expect(messageService.get()).toEqual('');
      });

  it('should dismiss the message',
      function () {
        var msgId = messageService.set('hello');
        messageService.dismiss(msgId);
        expect(messageService.get()).toEqual('');
      });

  it('should not dismiss the message if another message came later',
      function () {
        var msgId = messageService.set('hello');
        messageService.set('world');
        messageService.dismiss(msgId);
        expect(messageService.get()).toEqual('world');
      });
});


