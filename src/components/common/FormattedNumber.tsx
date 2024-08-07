import classNames from 'classnames'
import React, { useEffect, useRef } from 'react'
import { animated, useSpring } from 'react-spring'
import { isEqual } from 'lodash'

import { DEFAULT_SETTINGS } from 'constants/defaultSettings'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import useLocalStorage from 'hooks/localStorage/useLocalStorage'
import { formatValue } from 'utils/formatters'

interface Props {
  amount: number
  options?: FormatOptions
  className?: string
  animate?: boolean
  parentheses?: boolean
  smallerThanThreshold?: boolean
}

export const FormattedNumber = React.memo(
  (props: Props) => {
    const [reduceMotion] = useLocalStorage<boolean>(
      LocalStorageKeys.REDUCE_MOTION,
      DEFAULT_SETTINGS.reduceMotion,
    )
    const prevAmountRef = useRef<number>(0)

    let options = props.options
    const smallerThanThreshold = props.smallerThanThreshold

    if (smallerThanThreshold) {
      if (!options) options = { prefix: '< ' }
      if (options.prefix && options.prefix.substring(0, 1) !== '<')
        options.prefix = `< ${options.prefix}`
      else options.prefix = '< '
    }

    useEffect(() => {
      if (prevAmountRef.current !== props.amount) prevAmountRef.current = props.amount
    }, [props.amount])

    const springAmount = useSpring({
      number: isNaN(props.amount) ? 0 : props.amount,
      from: { number: isNaN(prevAmountRef.current) ? 0 : prevAmountRef.current },
      config: { duration: 1000 },
    })

    if (
      (prevAmountRef.current === props.amount && props.amount === 0) ||
      !props.animate ||
      reduceMotion
    )
      return (
        <p
          className={classNames(
            'number',
            props.parentheses && 'before:content-["("] after:content-[")"]',
            props.className,
          )}
        >
          {formatValue(props.amount.toString(), options)}
        </p>
      )

    return (
      <animated.p
        className={classNames(
          'number',
          props.parentheses && 'before:content-["("] after:content-[")"]',
          props.className,
        )}
      >
        {springAmount.number.to((num) => formatValue(num, props.options))}
      </animated.p>
    )
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
)

FormattedNumber.displayName = 'FormattedNumber'
