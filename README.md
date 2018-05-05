# TypeScript Maybe Type and Module

## Installation

```
$ npm install --save typescript-maybe
```

## Example Usage
```TypeScript
import { Maybe, MaybeType } from 'typescript-maybe'
import { compose, toUpper } from 'ramda'

// An example of a function you might write that explicitly returns a Maybe type:
function safeHead<T> (list: ReadonlyArray<T>): Maybe<T> {
  return list.length === 0
    ? { type: MaybeType.Nothing }
    : { type: MaybeType.Just, value: list[0] }
}

// Elegantly handling the Maybe in a composition chain:
type UpperCaseHead = (list: ReadonlyArray<string>) => Maybe<string>
const upperCaseHead: UpperCaseHead = compose(
  Maybe.map(toUpper),
  safeHead,
) as UpperCaseHead

// An example of an "unsafe" function that may return undefined or null:
function unsafeHead<T> (list: ReadonlyArray<T>): T {
  return list[0]
}

// Elegantly handling this unsafe function in a composition chain:
const otherUpperCaseHead: UpperCaseHead = compose(
  Maybe.map(toUpper),
  Maybe.of(unsafeHead),
) as UpperCaseHead

// Handling Maybe in a composition chain and returning a default value:
const upperCaseHeadWithDefault: UpperCaseHead = compose(
  Maybe.withDefault('Something didn’t quite go according to plan!'),
  Maybe.map(toUpper),
  Maybe.of(unsafeHead),
) as UpperCaseHead
```
