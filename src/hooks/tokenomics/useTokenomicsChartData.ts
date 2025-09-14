import { MRC_98_BURN_AMOUNT } from 'constants/math'
import { useMemo } from 'react'

interface TokenomicsDataItem {
  date: string
  amount: string
  value_usd: number
}

interface LiquidityDataItem {
  date: string
  value_usd: number
}

interface TokenomicsData {
  data: {
    burned_supply: TokenomicsDataItem[]
    treasury_supply: TokenomicsDataItem[]
    price_usd: LiquidityDataItem[]
    on_chain_liquidity_usd: LiquidityDataItem[]
  }
  meta: {
    token: {
      symbol: string
      denom: string
      decimals: number
    }
    last_updated: string
    total_records: number
    days_requested: number
  }
}

export function useTokenomicsChartData(tokenomicsData: TokenomicsData | null) {
  const burnedData = useMemo(() => {
    if (!tokenomicsData?.data.burned_supply) return null

    return tokenomicsData.data.burned_supply.slice().map((item: TokenomicsDataItem) => {
      // Find the corresponding price for this date
      const priceData = tokenomicsData.data.price_usd.find((price) => price.date === item.date)
      const marsPrice = priceData?.value_usd || 0

      // Add MRC-98 burn amount (300M MARS) to the burned supply
      const adjustedBurnedAmount = parseFloat(item.amount) + MRC_98_BURN_AMOUNT
      const adjustedBurnedValueUsd = item.value_usd + MRC_98_BURN_AMOUNT * marsPrice

      return {
        date: item.date,
        burned_amount: adjustedBurnedAmount,
        burned_value_usd: adjustedBurnedValueUsd,
      }
    })
  }, [tokenomicsData])

  const liquidityData = useMemo(() => {
    if (!tokenomicsData?.data.on_chain_liquidity_usd) return null

    return tokenomicsData.data.on_chain_liquidity_usd.slice().map((item: LiquidityDataItem) => ({
      date: item.date,
      liquidity_usd: item.value_usd,
    }))
  }, [tokenomicsData])

  const treasuryData = useMemo(() => {
    if (!tokenomicsData?.data.treasury_supply) return null

    return tokenomicsData.data.treasury_supply.slice().map((item: TokenomicsDataItem) => ({
      date: item.date,
      treasury_amount: parseFloat(item.amount),
      treasury_value_usd: item.value_usd,
    }))
  }, [tokenomicsData])

  return useMemo(
    () => ({
      burnedData,
      liquidityData,
      treasuryData,
    }),
    [burnedData, liquidityData, treasuryData],
  )
}
