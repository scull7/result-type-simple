
'use strict';

const assert = require('assert');
const R      = require('ramda');
const Result = require(__dirname + '/../index');

describe('Result Type', () => {
  
  describe('constructor', () => {

    it('should set isOK to false when an error is given', () => {
      let actual = Result(new Error('test'));
      assert.equal(actual.isOK, false);
    });

    it('should set value to the given error', () => {
      let err     = new Error('test');
      let actual  = Result(err);
      assert.equal(actual.value, err);
    });

    it('should set isOK to true when an err is null or undefined', () => {
      let actual = Result(null, 'test');
      assert.equal(actual.isOK, true);

      let actual2 = Result(undefined, 'test');
      assert.equal(actual2.isOK, true);
    });

    it('should set the value to the given value when no error is given', () => {
      let actual = Result(null, 'test');
      assert.equal(actual.value, 'test');

      let actual2 = Result(undefined, 'test');
      assert.equal(actual2.value, 'test');
    });
  });

  describe('isOK', () => {
    it('should return true when there isn\'t an error', () => {
      let actual = Result.isOK(Result(null, 'test'));
      assert.equal(actual, true);
    });

    it('should return false when there is an error', () => {
      let actual = Result.isOK(Result(new Error('test')));
      assert.equal(actual, false);
    });
  });

  describe('map', () => {
    it('should return the result unmodified when it is an error', () => {
      let err    = new Error('test');
      let result = Result(err, 1);
      let fn     = (x) => x + 1;
      let actual = Result.map(fn, result);

      assert.deepEqual(actual, result);

    });
    it('should apply the given function when isOK is true', () => {
      let result = Result(null, 1);
      let fn     = (x) => x + 1;
      let actual = Result.map(fn, result);

      assert.deepEqual(actual, Result(null, 2));
    });
  });


  describe('either', () => {
    it('should apply the ok function when there isn\'t an error', () => {
      let result = Result(null, 2);
      let errFn  = (x) => x - 1;
      let okFn   = (x) => x + 2;
      let actual = Result.either(errFn, okFn, result);

      assert.deepEqual(actual, Result(null, 4));
    });

    it('should appy the error function when there is an error', () => {
      let err    = new Error('either test');
      let result = Result(err, 1);
      let errFn  = (e) => e.message;
      let okFn   = (x) => x - 1;
      let actual = Result.either(errFn, okFn, result);

      assert.deepEqual(actual, Result(null, 'either test'));
    });
  });

  describe('curry', () => {
    let _Result = Result.curry(R.curry);

    it('should curry the map function', () => {
      let cMap = _Result.map((x) => x + 3);
      assert.deepEqual(cMap(Result(null, 4)), Result(null, 7));
    });

    it('should curry the either function', () => {
      let okFn    = (x) => x + 7;
      let errFn   = (x) => x.message;
      let cEither = _Result.either(errFn, okFn);

      assert.deepEqual(cEither(Result(null, 2)), Result(null, 9));
    });
  });

});
