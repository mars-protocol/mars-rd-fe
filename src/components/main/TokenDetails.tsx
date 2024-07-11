import MetricsCard from 'components/common/Card/MetricsCard'
import { GridGlobe } from 'components/common/Icons'
import useCirculatingSupply from 'hooks/tokenomics/useCirculatingSupply'
import useMarsTokenPrice from 'hooks/tokenomics/useMarsTokenPrice'
import useTotalSupply from 'hooks/tokenomics/useTotalSupply'
import { useMemo } from 'react'
import { BN } from 'utils/helpers'

export default function TokenDetails() {
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

  return (
    <MetricsCard
      background={
        <div className='absolute right-0 top-0 sm:w-[600px] transform scale-y-[-1]'>
          <GridGlobe />
        </div>
      }
      title='MARS'
      metrics={[
        {
          value: BN(marsTokenPrice ?? 0),
          label: 'Price',
          formatOptions: { prefix: '$', maxDecimals: 4, minDecimals: 2, abbreviated: true },
        },
        {
          value: marketCap,
          label: 'Market Cap',
          formatOptions: { prefix: '$', maxDecimals: 2, minDecimals: 2, abbreviated: true },
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
      ]}
      isLoading={isLoadingCirculatingSupply || isLoadingTotalSupply || isLoadingMarsTokenPrice}
    />
  )
}
