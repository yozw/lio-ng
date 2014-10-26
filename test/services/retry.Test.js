'use strict';

describe("retryService", function () {

  var retryService;
  var callCount, onSuccessCount, onAttemptFailCount, onFailCount;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    retryService = $injector.get('retryService');
    callCount = 0;
    onSuccessCount = 0;
    onAttemptFailCount = 0;
    onFailCount = 0;
  });

  function callFn() { callCount++; }
  function callFnWithException() { callCount++; throw "exception"; }
  function onSuccess() { onSuccessCount++; }
  function onAttemptFail() { onAttemptFailCount++; }
  function onFail() { onFailCount++; }
  function immediateSetTimeout(callback, timeout) { callback(); }

  it('calls the correct callbacks when failing',
      function () {
        var N = 10;
        retryService.retry()
            .call(callFn)
            .timeout(1)
            .maxAttempts(N)
            .successCheck(function() { return false; })
            .onSuccess(onSuccess)
            .onAttemptFail(onAttemptFail)
            .onFail(onFail)
            .withSetTimeout(immediateSetTimeout)
            .run();

        expect(callCount).toEqual(N);
        expect(onSuccessCount).toEqual(0);
        expect(onAttemptFailCount).toEqual(N);
        expect(onFailCount).toEqual(1);
      });

  it('calls the correct callbacks when exceptions are thrown',
      function () {
        var N = 10;
        retryService.retry()
            .call(callFnWithException)
            .timeout(1)
            .maxAttempts(N)
            .successCheck(function() { return false; })
            .onSuccess(onSuccess)
            .onAttemptFail(onAttemptFail)
            .onFail(onFail)
            .withSetTimeout(immediateSetTimeout)
            .run();

        expect(callCount).toEqual(N);
        expect(onSuccessCount).toEqual(0);
        expect(onAttemptFailCount).toEqual(N);
        expect(onFailCount).toEqual(1);
      });

  it('calls the correct callbacks when successful',
      function () {
        var N = 10;
        var K = 5;
        var attempt = 0;
        retryService.retry()
            .call(callFn)
            .timeout(1)
            .maxAttempts(N)
            .successCheck(function() { attempt++; return attempt >= K; })
            .onSuccess(onSuccess)
            .onAttemptFail(onAttemptFail)
            .onFail(onFail)
            .withSetTimeout(immediateSetTimeout)
            .run();

        expect(callCount).toEqual(K);
        expect(onSuccessCount).toEqual(1);
        expect(onAttemptFailCount).toEqual(K - 1);
        expect(onFailCount).toEqual(0);
      });

});


