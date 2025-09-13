import BigNumber from 'bignumber.js'
import { BN_ZERO } from 'constants/math'

import { BNCoin } from 'types/classes/BNCoin'
import { BN } from 'utils/helpers'

const getTokenSymbol = (denom: string, marketAssets: Asset[]) =>
  marketAssets.find((asset) => asset.denom.toLowerCase() === denom.toLowerCase())?.symbol ?? ''

const getTokenDecimals = (denom: string, marketAssets: Asset[]) =>
  marketAssets.find((asset) => asset.denom.toLowerCase() === denom.toLowerCase())?.decimals ?? 6

const getTokenIcon = (denom: string, marketAssets: Asset[]) =>
  marketAssets.find((asset) => asset.denom.toLowerCase() === denom.toLowerCase())?.logo ?? ''

export function getTokenPrice(denom: string, assets: Asset[], fallback?: BigNumber): BigNumber {
  const price = assets.find((asset) => asset.denom === denom)?.price?.amount
  if (!price) return fallback ?? BN_ZERO
  return BN(price)
}

function getDebtAmountWithInterest(debt: BigNumber, apr: number) {
  return debt.times(1 + apr / 365 / 24).integerValue()
}

function getDenomsFromBNCoins(coins: BNCoin[]) {
  return coins.map((coin) => coin.denom)
}
