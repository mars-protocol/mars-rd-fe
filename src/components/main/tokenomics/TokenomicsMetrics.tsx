'use client'
import MetricsCard from 'components/common/Card/MetricsCard'
import { GridToken } from 'components/common/Icons'
import { BN_ZERO, MRC_98_BURN_AMOUNT } from 'constants/math'
import useCirculatingSupply from 'hooks/tokenomics/useCirculatingSupply'
import useStakedSupply from 'hooks/tokenomics/useStakedSupply'
import useTokenomicsData from 'hooks/tokenomics/useTokenomicsData'
import useTotalSupply from 'hooks/tokenomics/useTotalSupply'
import { useMemo } from 'react'
import { BN } from 'utils/helpers'

export default function TokenomicsMetrics() {
  const { data: circulatingSupplyData, isLoading: isLoadingCirculatingSupply } =
    useCirculatingSupply()
  const { data: stakedSupplyData, isLoading: isLoadingStakedSupply } = useStakedSupply()
  const { data: totalSupplyData, isLoading: isLoadingTotalSupply } = useTotalSupply()
  const { data: tokenomicsData, isLoading: isLoadingTokenomicsData } = useTokenomicsData('30')

  const circulatingSupply = circulatingSupplyData ?? 0
  const stakedSupply = stakedSupplyData ?? 0
  const totalSupply = totalSupplyData ?? 0

  // Get the latest price from tokenomics data (first element is most recent)
  const marsTokenPrice = useMemo(() => {
    if (!tokenomicsData?.data?.price_usd?.length) return BN_ZERO
    return BN(tokenomicsData.data.price_usd[0].value_usd)
  }, [tokenomicsData])

  // Market caps
  const marketCap = useMemo(
    () => BN(totalSupply).multipliedBy(marsTokenPrice),
    [totalSupply, marsTokenPrice],
  )
  const circulatingMarketCap = useMemo(
    () => BN(circulatingSupply).multipliedBy(marsTokenPrice),
    [circulatingSupply, marsTokenPrice],
  )
  const stakedMarketCap = useMemo(
    () => BN(stakedSupply).multipliedBy(marsTokenPrice),
    [stakedSupply, marsTokenPrice],
  )

  const totalValueBurned = useMemo(() => {
    if (!tokenomicsData?.data?.burned_supply?.length) return BN_ZERO
    // Add MRC-98 burn amount value (300M * current MARS price) to the burned value
    const mrc98BurnValue = BN(MRC_98_BURN_AMOUNT).multipliedBy(marsTokenPrice)
    return BN(tokenomicsData.data.burned_supply[0].value_usd).plus(mrc98BurnValue)
  }, [tokenomicsData, marsTokenPrice])

  const totalBurnedSupply = useMemo(() => {
    if (!tokenomicsData?.data?.burned_supply?.length) return BN_ZERO
    // Add MRC-98 burn amount (300M MARS) to the burned supply
    return BN(tokenomicsData.data.burned_supply[0].amount).plus(MRC_98_BURN_AMOUNT)
  }, [tokenomicsData])

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
      value: stakedMarketCap,
      label: 'Staked Value',
      isCurrency: true,
      formatOptions: { abbreviated: true },
    },
    {
      value: totalValueBurned,
      label: 'Total Value Burned',
      isCurrency: true,
      formatOptions: { abbreviated: true },
    },
  ]

  const isLoading =
    isLoadingCirculatingSupply ||
    isLoadingStakedSupply ||
    isLoadingTotalSupply ||
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
