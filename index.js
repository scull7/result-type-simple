

// type Result a = Error String | OK a
function Result(err, ok) {
  if (err) {
    return {
      isOK: false,
      value: err
    };
  }

  return {
    isOK: true,
    value: ok
  };
}


// map : (a -> b) -> Result a -> Result b
Result.map = function(fn, result) {
  if (Result.isOK(result)) {
    return Result(null, fn(result.value));
  }
  return result;
};


// isOK : Result a -> Bool
Result.isOK = function(result) {
  return result.isOK ? true : false;
};


// either : (a -> b) -> (a -> b) -> Result a -> Result b
Result.either = function(errFn, okFn, result) {
  if (Result.isOK(result)) {
    return Result.map(okFn, result);
  } else {
    return Result.map(errFn, Result(null, result.value));
  }
};


// chain : (Result a -> Result b) -> Result a -> Result b
Result.chain = function(fn, result) {
  if (Result.isOK(result)) {
    return fn(result.value)
  } else {
    return result
  }
};


// A function that will return a curried version of the `map` and `either`
// methods using the curry module of your choosing.
Result.curry = function(curry_impl) {
  Result.map    = curry_impl(Result.map);
  Result.either = curry_impl(Result.either);
  Result.chain  = curry_impl(Result.chain);

  return Result;
};


module.exports = Result;
