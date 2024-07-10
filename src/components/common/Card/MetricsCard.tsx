import Card from 'components/common/Card'
import Text from 'components/common/Text'
import { BNCoin } from 'types/classes/BNCoin'
import DisplayCurrency from 'components/common/DisplayCurrency'
import { FormattedNumber } from 'components/common/FormattedNumber'
import React from 'react'

interface Props {
  title: string
  background: React.ReactNode
  copy?: string
  metrics: Metric[]
}

interface Metric {
  isCurrency: boolean
  value: BigNumber
  label: string
}

export default function MetricsCard(props: Props) {
  const { title, copy, metrics, background } = props

  return (
    <Card
      className='flex flex-col justify-between p-8 h-80 w-[850px]'
      title={<h1 className='text-5xl font-bold mb-4'>{title}</h1>}
    >
      <div className='absolute inset-0 w-full h-full opacity-10'>{background}</div>
      <div className='flex-grow'></div>
      {copy && (
        <Text className='mb-8' size='sm'>
          {copy}
        </Text>
      )}
      {metrics.map((metric: Metric, index: number) => {
        if (metric.isCurrency) {
          const coin = BNCoin.fromDenomAndBigNumber('uusd', metric.value)

          return (
            <React.Fragment key={index}>
              <DisplayCurrency coin={coin} />
              <Text size='sm' className='text-white/40'>
                {metric.label}
              </Text>
            </React.Fragment>
          )
        }

        return (
          <React.Fragment key={index}>
            <FormattedNumber amount={metric.value.toNumber()} />
            <Text size='sm' className='text-white/40'>
              {metric.label}
            </Text>
          </React.Fragment>
        )
      })}
    </Card>
  )
}
