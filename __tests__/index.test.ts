import {
  compose,
  curry,
  toUpper,
} from 'ramda'
import {
  Just,
  Maybe,
  MaybeType,
} from '../src/index'

describe('the Maybe module', () => {
  const name: string = 'noob noob'

  describe('Maybe.of', () => {
    describe('when given a null', () => {
      it('returns a Nothing', () => {
        const result: Maybe<string> = Maybe.of(null)
        expect(result.type).toBe(MaybeType.Nothing)
      })
    })

    describe('when given an undefined', () => {
      it('returns a Nothing', () => {
        const result: Maybe<string> = Maybe.of(undefined)
        expect(result.type).toBe(MaybeType.Nothing)
      })
    })

    describe('when given a concrete value', () => {
      it('returns a Just', () => {
        const result: Just<string> = Maybe.of(name) as Just<string>
        expect(result.type).toBe(MaybeType.Just)
        expect(result.value).toBe(name)
      })
    })
  })

  describe('Maybe.map', () => {
    describe('when given a Nothing', () => {
      it('returns a Nothing', () => {
        const result: Maybe<string> = Maybe.map(toUpper, Maybe.of(null)) as Maybe<string>
        expect(result).toEqual(Maybe.of(null))
      })
    })

    describe('when given a Just', () => {
      it('applies the provided function to the Just value', () => {
        const result: Maybe<string> = Maybe.map(toUpper, Maybe.of(name)) as Maybe<string>
        expect(result).toEqual(Maybe.of(toUpper(name)))
      })
    })
  })

  describe('Maybe.andThen', () => {
    const safeDivide = curry((a: number, b: number): Maybe<number> => {
      return a === 0
        ? Maybe.of(null)
        : Maybe.of(b / a)
    })

    describe('when we encounter a Nothing in a composition chain', () => {
      it('gracefully handles the absence', () => {
        const result = compose(
          Maybe.andThen(safeDivide(3)),
          Maybe.andThen(safeDivide(0)),
          Maybe.andThen(safeDivide(4)),
          safeDivide(2),
        )(32)
        expect(result).toEqual(Maybe.of(null))
      })
    })

    describe('when a composition chain works out according to plan', () => {
      it('returns our desired result', () => {
        const result = compose(
          Maybe.andThen(safeDivide(3)),
          Maybe.andThen(safeDivide(5)),
          Maybe.andThen(safeDivide(4)),
          safeDivide(2),
        )(32)
        expect(result).toEqual(Maybe.of(32 / 2 / 4 / 5 / 3))
      })
    })
  })

  describe('Maybe.withDefault', () => {
    describe('when given a default value and a Nothing', () => {
      it('returns the default value', () => {
        const result = Maybe.withDefault(name, Maybe.of(null)) as string
        expect(result).toBe(name)
      })
    })

    describe('when given a default value and a Just', () => {
      it('returns the Just value', () => {
        const result = Maybe.withDefault('foo', Maybe.of(name)) as string
        expect(result).toBe(name)
      })
    })
  })

  describe('Maybe.ap', () => {
    describe('when the applicative Maybe is Nothing', () => {
      it('returns a Nothing', () => {
        const result = Maybe.ap(Maybe.of(null), Maybe.of(name))
        expect(result).toEqual(Maybe.of(null))
      })
    })

    describe('when the target Maybe is Nothing', () => {
      it('returns a Nothing', () => {
        const result = Maybe.ap(Maybe.of(toUpper), Maybe.of(null))
        expect(result).toEqual(Maybe.of(null))
      })
    })

    describe('when both the applicative and target Maybes are Justs', () => {
      it('applies the wrapped function in the applicative Maybe to value in the target Maybe', () => {
        const result = Maybe.ap(Maybe.of(toUpper), Maybe.of(name))
        expect(result).toEqual(Maybe.of(toUpper(name)))
      })
    })
  })
})
