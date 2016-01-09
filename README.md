[![Build Status](https://travis-ci.org/scull7/result-type-simple.svg)](https://travis-ci.org/scull7/result-type-simple)
[![Coverage Status](https://coveralls.io/repos/scull7/result-type-simple/badge.svg?branch=master&service=github)](https://coveralls.io/github/scull7/result-type-simple?branch=master)

# result-type-simple
A simple Result object type implementation that I like and want to use in several projects.

### type Result a = Error String | OK a

The `Result` constructor takes an `err` and an `ok` parameter.

* `err` - when provided the Result object is considered to be errored out.
* `ok` - this will be the assigned value of the Result object.

### `isOK` : Result a -> Bool

Given a Result object determine if it is not an error.

### `map` : (a -> b) -> Result a -> Result b

Given a function that transforms the Result value from a -> b, that function
will be applied if Result.isOK is true. Otherwise the original result will
be returned.

### `either` (a -> b) -> (a -> b) -> Result a -> Result b

Given 2 functions, the first function will be called when Result.isOK is false
and the second when Result.isOK is true. Both functions will receive the 
Result object's value.

### `chain` (Result a -> Result b) -> Result a -> Result b

Given a function that returns a result map the unwrapped result value to the
input of that function.  The given function is responsible for returning
a Result object.  This can effectively be used as an unwrap function.

### `curry` (a -> a) -> Result (really, it's just a guess at best)

Enables you to curry the `map` and `either` functions with the curry library
of your choice.

Example (es6):

```javascript
import { curry } from 'ramda';
import { curry as ResultCurry } from 'result-type-simple';

const Result = ResultCurry(curry);

```

Example (es5):

```javascript
var curry = require('ramda').curry
var Result = require('result-type-simple').curry(curry);
```
