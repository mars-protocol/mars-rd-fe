import classNames from 'classnames'
import Card from 'components/common/Card'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import { Tooltip } from 'components/common/Tooltip'
import React from 'react'

interface Props {
  title?: string
  background?: React.ReactNode
  copy?: string
  metrics: Metric[]
  isLoading?: boolean
  className?: string
  hideBackground?: boolean
  numberClassName?: string
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
    numberClassName,
  } = props

  return (
    <Card
      className={classNames('p-5 sm:p-10', className)}
      title={
        <Text tag='h1' className='text-4xl md:text-5xl font-bold'>
          {title}
        </Text>
      }
    >
      {!hideBackground && (
        <div className='absolute inset-0 w-full h-full opacity-10 -z-10'>{background}</div>
      )}
      {copy && (
        <Text className='mb-8 text-white/50' size='sm'>
          {copy}
        </Text>
      )}
      <div className='flex flex-wrap justify-evenly text-center'>
        {metrics.map((metric: Metric, index: number) => (
          <div className='min-w-28 p-2' key={index}>
            {isLoading ? (
              <Loading className='w-full h-8' />
            ) : metric.isCurrency ? (
              <FormattedNumber
                className={classNames(`w-full ${numberClassName}`)}
                amount={metric.value.toNumber()}
                options={{
                  ...metric.formatOptions,
                  prefix: '$',
                }}
              />
            ) : (
              <FormattedNumber
                className={classNames(`w-full ${numberClassName}`)}
                amount={metric.value.toNumber()}
                options={metric.formatOptions}
              />
            )}
            <div className='flex items-center justify-center space-x-1'>
              <Text size='xs' className='text-white/40'>
                {metric.label}
              </Text>
              {metric.tooltipContent && (
                <Tooltip
                  type='info'
                  content={<Text size='xs'>{metric.tooltipContent}</Text>}
                  key={`tooltip-${index}`}
                  disabled={isLoading}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
