import MetricsCard from 'components/common/Card/MetricsCard'
import { GridToken } from 'components/common/Icons'
import { BN_ZERO } from 'constants/math'
import useCirculatingSupply from 'hooks/tokenomics/useCirculatingSupply'
import useMarsTokenPrice from 'hooks/tokenomics/useMarsTokenPrice'
import useTokenomicsData from 'hooks/tokenomics/useTokenomicsData'
import useTotalSupply from 'hooks/tokenomics/useTotalSupply'
import { useMemo } from 'react'
import { BN } from 'utils/helpers'

export default function TokenomicsMetrics() {
  const { data: circulatingSupplyData, isLoading: isLoadingCirculatingSupply } =
    useCirculatingSupply()
  const { data: totalSupplyData, isLoading: isLoadingTotalSupply } = useTotalSupply()
  const { data: marsTokenPriceData, isLoading: isLoadingMarsTokenPrice } = useMarsTokenPrice()
  const { isLoading: isLoadingTokenomicsData } = useTokenomicsData('30')

  const circulatingSupply = circulatingSupplyData ?? 0
  const totalSupply = totalSupplyData ?? 0
  const marsTokenPrice = marsTokenPriceData ?? BN_ZERO

  // Market caps
  const marketCap = useMemo(
    () => BN(totalSupply).multipliedBy(marsTokenPrice),
    [totalSupply, marsTokenPrice],
  )
  const circulatingMarketCap = useMemo(
    () => BN(circulatingSupply).multipliedBy(marsTokenPrice),
    [circulatingSupply, marsTokenPrice],
  )

  const metrics: Metric[] = [
    {
      value: marketCap,
      label: 'Fully Diluted Valuation',
      isCurrency: true,
      formatOptions: { abbreviated: true },
    },
    {
      value: circulatingMarketCap,
      label: 'Market Cap',
      isCurrency: true,
      formatOptions: { abbreviated: true },
    },
    {
      value: BN(totalSupply),
      label: 'Total Supply',
      formatOptions: { abbreviated: true },
    },
    {
      value: BN(circulatingSupply),
      label: 'Circulating Supply',
      formatOptions: { abbreviated: true },
    },
  ]

  const isLoading =
    isLoadingCirculatingSupply ||
    isLoadingTotalSupply ||
    isLoadingMarsTokenPrice ||
    isLoadingTokenomicsData

  return (
    <MetricsCard
      hideBackground={false}
      background={
        <div className='absolute right-0 top-0 w-90 sm:w-160 md:w-180 transform scale-y-[-1]'>
          <GridToken />
        </div>
      }
      title='MARS TOKENOMICS'
      copy='Explore MARS tokenomics overview.'
      isLoading={isLoading}
      metrics={metrics}
      className='gap-5 w-full sm:gap-10 md:gap-18'
      numberClassName='text-2xl md:text-4xl'
    />
  )
}
