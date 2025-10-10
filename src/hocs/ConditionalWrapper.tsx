import React from 'react'

interface Props {
  condition: boolean
  wrapper: (children: React.ReactNode) => React.ReactElement
  children: React.ReactNode
}

export default function ConditionalWrapper(props: Props) {
  const { condition, wrapper, children } = props
  return condition ? wrapper(children) : <>{children}</>
}
