import Card from 'components/common/Card'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import React from 'react'

interface Props {
  title?: string
  background?: React.ReactNode
  copy?: string
  metrics: Metric[]
  isLoading?: boolean
  className?: string
  hideBackground?: boolean
  formattedNumberClassName?: string
}

export default function MetricsCard(props: Props) {
  const {
    title,
    copy,
    metrics,
    background,
    isLoading,
    className,
    hideBackground,
    formattedNumberClassName,
  } = props

  return (
    <Card
      className={`flex flex-col justify-between mx-auto my-5 p-5 ${className}`}
      title={<h1 className='text-4xl md:text-5xl font-bold'>{title}</h1>}
    >
      {!hideBackground && (
        <div className='absolute inset-0 w-full h-full opacity-10 -z-1'>{background}</div>
      )}
      {copy && (
        <Text className='mb-8 text-white/50' size='sm'>
          {copy}
        </Text>
      )}
      <div className='flex flex-wrap justify-evenly gap-3 text-center'>
        {metrics.map((metric: Metric, index: number) => {
          return (
            <div className='min-w-[110px] p-2' key={index}>
              {isLoading ? (
                <Loading className='w-full h-8' />
              ) : (
                <FormattedNumber
                  className={`w-full ${formattedNumberClassName}`}
                  amount={metric.value.toNumber()}
                  options={metric.formatOptions}
                  animate
                />
              )}
              <Text size='xs' className='w-full text-white/40'>
                {metric.label}
              </Text>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
