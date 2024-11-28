import getDexAssets from 'api/assets/getDexAssets'
import { getRedBankQueryClient } from 'api/cosmwasm-client'
import { BN_ZERO } from 'constants/math'
import { BN } from 'utils/helpers'

export default async function getTvl(chainConfig: ChainConfig): Promise<BigNumber> {
  try {
    const redBankQueryClient = await getRedBankQueryClient(chainConfig)
    const [markets, dexAssets] = await Promise.all([
      redBankQueryClient.markets({}),
      getDexAssets(chainConfig),
    ])

    let totalValue = BN(0)

    for (const market of markets) {
      const asset = dexAssets.find((a) => a.denom === market.denom)

      if (!asset?.price) continue
      const price = BN(asset.price.amount)

      const collateralScaled = BN(market.collateral_total_scaled)
      const collateralAmount = await redBankQueryClient.underlyingLiquidityAmount({
        amountScaled: collateralScaled.toString(),
        denom: market.denom,
      })
      const debtScaled = BN(market.debt_total_scaled)
      const debtAmount = await redBankQueryClient.underlyingDebtAmount({
        amountScaled: debtScaled.toString(),
        denom: market.denom,
      })

      const collateralValue = BN(collateralAmount).multipliedBy(price).shiftedBy(-asset.decimals)
      const debtValue = BN(debtAmount).multipliedBy(price).shiftedBy(-asset.decimals)

      totalValue = totalValue.plus(collateralValue).minus(debtValue)
    }
    return totalValue
  } catch (error) {
    console.error('Error calculating TVL:', error)
    return BN_ZERO
  }
}
