
R       = require 'ramda'
assert  = require 'assert'
Result  = require __dirname + '/../index'

describe 'Result Type', ->

  describe 'constructor', ->

    it 'should set isOK to false when an error is given', ->

      actual = Result(new Error('test'))
      assert.equal(actual.isOK, false)

    it 'should set value to the given error', ->

      err     = new Error('test')
      actual  = Result(err)

      assert.equal(actual.value, err)

    it 'should set isOK to true when err is null or undefined', ->

      actual = Result(null, 'test')
      assert.equal(actual.isOK, true)

      actual2 = Result(undefined, 'test')
      assert.equal(actual.isOK, true)

    it 'should set the value to the given value when no error is given', ->

      actual = Result(null, 'test')
      assert.equal(actual.value, 'test')

      actual2 = Result(undefined, 'test')
      assert.equal(actual.value, 'test')


  describe 'isOK', ->

    it 'should return true when there isn\'t an error', ->

      actual = Result.isOK Result(null, 'test')
      assert.equal(actual, true)

    it 'should return false when there is an error', ->

      actual = Result.isOK Result(new Error('test'))
      assert.equal(actual, false)


  describe 'map', ->

    it 'should return the result unmodified when it is an error', ->

      err     = new Error('test')
      result  = Result(err, 1)
      fn      = (x) -> x + 1
      actual  = Result.map fn, result

      assert.deepEqual actual, result

    it 'should apply the given function when isOK is true', ->

      result  = Result(null, 1)
      fn      = (x) -> x + 1
      actual  = Result.map fn, result

      assert.deepEqual actual, Result(null, 2)


  describe 'either', ->

    it 'should apply the ok function when there isn\'t an error', ->

      result  = Result(null, 2)
      errFn   = (x) -> x - 1
      okFn    = (x) -> x + 2
      actual  = Result.either errFn, okFn, result

      assert.deepEqual actual, Result(null, 4)

    it 'should apply the error function when there is an error', ->

      err     = new Error('either test')
      result  = Result(err, 2)
      errFn   = (e) -> e.message
      okFn    = (x) -> x + 2
      actual  = Result.either errFn, okFn, result

      assert.deepEqual actual, Result(null, 'either test')


  describe 'curry', ->

    _Result = Result.curry R.curry

    it 'should curry the map function', ->

      cMap = _Result.map (x) -> x + 3
      assert.deepEqual cMap(Result(null, 4)), Result(null, 7)

    it 'should curry the either function', ->

      okFn    = (x) -> x + 7
      errFn   = (x) -> x.message
      cEither = _Result.either(errFn, okFn)

      assert.deepEqual cEither(Result(null, 2)), Result(null, 9)

    it 'should curry the chain function', ->

      fn = (x) -> Result null, x + 17
      cChain = _Result.chain(fn)

      assert.deepEqual cChain(Result(null, 2)), Result(null, 19)

      
  describe 'chain', ->

    it 'should apply the value to the given function if Result.isOK is true',
    ->
      fn      = (x) -> Result(null, x + 8)
      actual  = Result.chain fn, Result(null, 2)

      assert.deepEqual actual, Result(null, 10)

    it 'should just forward the result if Result.isOK is false', ->

      fn      = (x) -> Result(null, x + 8)
      actual  = Result.chain fn, Result(new Error('test'), 2)

      assert.deepEqual actual, Result(new Error('test'))
