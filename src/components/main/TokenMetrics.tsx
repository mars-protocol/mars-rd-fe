import Card from 'components/common/Card'
import { FormattedNumber } from 'components/common/FormattedNumber'
import Loading from 'components/common/Loading'
import Text from 'components/common/Text'
import useCirculatingSupply from 'hooks/tokenomics/useCirculatingSupply'
import useMarsTokenPrice from 'hooks/tokenomics/useMarsTokenPrice'
import useTotalSupply from 'hooks/tokenomics/useTotalSupply'
import { useMemo } from 'react'
import { BN } from 'utils/helpers'

export default function TokenMetrics() {
  const { data: circulatingSupply, isLoading: isLoadingCirculatingSupply } = useCirculatingSupply()
  const { data: totalSupply, isLoading: isLoadingTotalSupply } = useTotalSupply()
  const { data: marsTokenPrice, isLoading: isLoadingMarsTokenPrice } = useMarsTokenPrice()

  const marketCap = useMemo(
    () => BN(circulatingSupply ?? 0).multipliedBy(marsTokenPrice ?? 0),
    [circulatingSupply, marsTokenPrice],
  )
  const FDV = useMemo(
    () => BN(totalSupply ?? 0).multipliedBy(marsTokenPrice ?? 0),
    [totalSupply, marsTokenPrice],
  )

  const metrics: Metric[] = [
    {
      value: BN(marsTokenPrice ?? 0),
      label: 'Price',
      formatOptions: { prefix: '$', maxDecimals: 4, minDecimals: 2, abbreviated: true },
    },
    {
      value: marketCap,
      label: 'Market Cap',
      formatOptions: {
        prefix: '$',
        maxDecimals: 2,
        minDecimals: 2,
        abbreviated: true,
      },
    },
    {
      value: BN(totalSupply ?? 0),
      label: 'Total Supply',
      formatOptions: { abbreviated: true },
    },
    {
      value: BN(circulatingSupply ?? 0),
      label: 'Circulating Supply',
      formatOptions: { abbreviated: true },
    },
    {
      value: FDV,
      label: 'FDV',
      formatOptions: { prefix: '$', maxDecimals: 2, minDecimals: 2, abbreviated: true },
    },
  ]

  const isLoading = isLoadingCirculatingSupply || isLoadingTotalSupply || isLoadingMarsTokenPrice

  return (
    <div className='w-full flex justify-between gap-4'>
      {metrics.map((metric, index) => {
        return (
          <Card className='w-full py-6 text-center' key={index}>
            {isLoading ? (
              <Loading className='w-full h-8' />
            ) : (
              <FormattedNumber
                className='w-full text-sm'
                amount={metric.value.toNumber()}
                options={metric.formatOptions}
                animate
              />
            )}
            <Text size='xs' className='w-full text-white/40'>
              {metric.label}
            </Text>
          </Card>
        )
      })}
    </div>
  )
}
