import {
  ArrayOfCoin,
  Positions,
  VaultUtilizationResponse,
} from 'types/generated/mars-credit-manager/MarsCreditManager.types'
import { ArrayOfActiveEmission } from 'types/generated/mars-incentives/MarsIncentives.types'
import { PriceResponse } from 'types/generated/mars-oracle-osmosis/MarsOracleOsmosis.types'
import {
  AssetParamsBaseForAddr,
  TotalDepositResponse,
  VaultConfigBaseForAddr,
} from 'types/generated/mars-params/MarsParams.types'
import {
  ArrayOfMarket,
  ArrayOfUserDebtResponse,
} from 'types/generated/mars-red-bank/MarsRedBank.types'

interface Cache<T> extends Map<string, { data: T | null; timestamp: number }> {}

let totalRequests = 0
let cachedRequests = 0

export async function cacheFn<T>(
  fn: () => Promise<T>,
  cache: Cache<T>,
  key: string,
  staleAfter = 5,
) {
  const cachedData = cache.get(key)?.data
  const isStale = (cache.get(key)?.timestamp || 0) + 1000 * staleAfter < new Date().getTime()

  totalRequests += 1

  if (cachedData && !isStale) {
    cachedRequests += 1
    return cachedData
  }

  const data = await fn()
  cache.set(key, { data, timestamp: new Date().getTime() })

  return data
}

const positionsCache: Cache<Positions> = new Map()
const aprsCacheResponse: Cache<Response> = new Map()
const aprsCache: Cache<AprResponse> = new Map()
const vaultConfigsCache: Cache<VaultConfigBaseForAddr[]> = new Map()
const vaultUtilizationCache: Cache<VaultUtilizationResponse> = new Map()
const unlockPositionsCache: Cache<VaultExtensionResponse> = new Map()
const estimateWithdrawCache: Cache<Coin[]> = new Map()
const previewRedeemCache: Cache<string> = new Map()
const priceCache: Cache<BigNumber> = new Map()
const pythPriceCache: Cache<PythConfidenceData> = new Map()
const oraclePriceCache: Cache<PriceResponse[]> = new Map()
const poolPriceCache: Cache<PriceResponse[]> = new Map()
const emissionsCache: Cache<ArrayOfActiveEmission> = new Map()
const marketCache: Cache<Market> = new Map()
const marketsCache: Cache<ArrayOfMarket> = new Map()
const underlyingLiquidityAmountCache: Cache<string> = new Map()
const unclaimedRewardsCache: Cache<ArrayOfCoin> = new Map()
const totalDepositCache: Cache<TotalDepositResponse> = new Map()
const allParamsCache: Cache<AssetParamsBaseForAddr[]> = new Map()
const underlyingDebtCache: Cache<string> = new Map()
const previewDepositCache: Cache<{ vaultAddress: string; amount: string }> = new Map()
const stakingAprCache: Cache<StakingApr[]> = new Map()
export const assetParamsCache: Cache<AssetParamsBaseForAddr[]> = new Map()
const userDebtCache: Cache<ArrayOfUserDebtResponse> = new Map()
