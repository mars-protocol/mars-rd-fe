import getDexAssets from 'api/assets/getDexAssets'
import { getOracleQueryClientNeutron, getRedBankQueryClient } from 'api/cosmwasm-client'
import { BN_ZERO } from 'constants/math'
import { BN } from 'utils/helpers'

export default async function getTvl(chainConfig: ChainConfig): Promise<BigNumber> {
  try {
    const redBankQueryClient = await getRedBankQueryClient(chainConfig)
    const oracleQueryClient = await getOracleQueryClientNeutron(chainConfig)
    const [markets, dexAssets] = await Promise.all([
      redBankQueryClient.markets({}),
      getDexAssets(chainConfig),
    ])

    let totalValue = BN(0)

    for (const market of markets) {
      const asset = dexAssets.find((a) => a.denom === market.denom)

      // Try to get price from oracle if dexAssets price is missing
      let price
      if (asset?.price) {
        price = BN(asset.price.amount)
      } else {
        const oraclePrice = await oracleQueryClient.price({ denom: market.denom })
        price = BN(oraclePrice.price)
      }

      if (!price) {
        console.log(`No price found for ${market.denom} in either dexAssets or oracle`)
        continue
      }

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

      const decimals = asset?.decimals ?? 6
      const collateralValue = BN(collateralAmount).multipliedBy(price).shiftedBy(-decimals)
      const debtValue = BN(debtAmount).multipliedBy(price).shiftedBy(-decimals)

      totalValue = totalValue.plus(collateralValue).minus(debtValue)
    }
    return totalValue
  } catch (error) {
    console.error('Error calculating TVL:', error)
    return BN_ZERO
  }
}
