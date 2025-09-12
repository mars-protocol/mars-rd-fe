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

    return tokenomicsData.data.burned_supply
      .slice()
      .reverse() // Reverse to get chronological order
      .map((item: TokenomicsDataItem) => ({
        date: item.date,
        burned_amount: parseFloat(item.amount),
        burned_value_usd: item.value_usd, // USD value is already correct
      }))
  }, [tokenomicsData])

  const liquidityData = useMemo(() => {
    if (!tokenomicsData?.data.on_chain_liquidity_usd) return null

    return tokenomicsData.data.on_chain_liquidity_usd
      .slice()
      .reverse() // Reverse to get chronological order
      .map((item: LiquidityDataItem) => ({
        date: item.date,
        liquidity_usd: item.value_usd,
      }))
  }, [tokenomicsData])

  const treasuryData = useMemo(() => {
    if (!tokenomicsData?.data.treasury_supply) return null

    return tokenomicsData.data.treasury_supply
      .slice()
      .reverse() // Reverse to get chronological order
      .map((item: TokenomicsDataItem) => ({
        date: item.date,
        treasury_amount: parseFloat(item.amount),
        treasury_value_usd: item.value_usd, // USD value is already correct
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
