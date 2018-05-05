# TypeScript Maybe Type and Module

## Installation

```
$ npm install --save typescript-maybe
```

## Example Usage
```TypeScript
import { Maybe } from 'typescript-maybe'
import { compose, toUpper } from 'ramda'

// An example of a function you might write that returns a Maybe type:
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

```
