'use strict';

describe("messageService", function () {

  var messageService;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    messageService = $injector.get('messageService');
  });

  it('sets and gets the message',
      function () {
        messageService.set('hello');
        expect(messageService.get()).toEqual('hello');
      });

  it('clears the message',
      function () {
        messageService.set('hello');
        messageService.clear();
        expect(messageService.get()).toEqual('');
      });

  it('dismisses the message',
      function () {
        var msgId = messageService.set('hello');
        messageService.dismiss(msgId);
        expect(messageService.get()).toEqual('');
      });

  it('does not dismiss the message if another message came later',
      function () {
        var msgId = messageService.set('hello');
        messageService.set('world');
        messageService.dismiss(msgId);
        expect(messageService.get()).toEqual('world');
      });
});


