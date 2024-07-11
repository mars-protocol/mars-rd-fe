import Card from 'components/common/Card'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import React from 'react'

interface Props {
  title: string
  background: React.ReactNode
  copy?: string
  metrics: Metric[]
  isLoading?: boolean
}

interface Metric {
  value: BigNumber
  label: string
  formatOptions: {
    prefix?: string
    maxDecimals?: number
    minDecimals?: number
    abbreviated?: boolean
  }
}

export default function MetricsCard(props: Props) {
  const { title, copy, metrics, background, isLoading } = props

  return (
    <Card
      className='flex flex-col justify-between p-8 h-80 w-[850px]'
      title={<h1 className='mb-4 text-5xl font-bold'>{title}</h1>}
    >
      <div className='absolute inset-0 w-full h-full opacity-10 -z-1'>{background}</div>
      <div className='flex-grow'></div>
      {copy && (
        <Text className='mb-8' size='sm'>
          {copy}
        </Text>
      )}
      <div className='flex justify-between w-full'>
        {metrics.map((metric: Metric, index: number) => {
          return (
            <div className='flex flex-wrap w-[140px]' key={index}>
              {isLoading ? (
                <Loading className='w-full h-8' />
              ) : (
                <FormattedNumber
                  className='w-full text-2xl'
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
