import BigNumber from 'bignumber.js'

import { BN_ZERO } from 'constants/math'
import { ORACLE_DENOM } from 'constants/oracle'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { BNCoin } from 'types/classes/BNCoin'
import { VaultPosition } from 'types/generated/mars-credit-manager/MarsCreditManager.types'
import { Positions } from 'types/generated/mars-rover-health-computer/MarsRoverHealthComputer.types'
import { byDenom } from 'utils/array'
import { getCoinValue } from 'utils/formatters'
import { BN } from 'utils/helpers'
import { convertApyToApr } from 'utils/parsers'

export const calculateAccountBalanceValue = (
  account: Account | AccountChange,
  assets: Asset[],
): BigNumber => {
  const [deposits, lends, debts, vaults, perps, perpsVault, stakedAstroLps] =
    getAccountPositionValues(account, assets)

  return deposits
    .plus(lends)
    .plus(vaults)
    .plus(perps)
    .plus(perpsVault)
    .plus(stakedAstroLps)
    .minus(debts)
}

export const getAccountPositionValues = (account: Account | AccountChange, assets: Asset[]) => {
  const deposits = calculateAccountValue('deposits', account, assets)
  const lends = calculateAccountValue('lends', account, assets)
  const debts = calculateAccountValue('debts', account, assets)
  const vaults = calculateAccountValue('vaults', account, assets)
  const perps = calculateAccountValue('perps', account, assets)
  const perpsVault = calculateAccountValue('perpsVault', account, assets)
  const stakedAstroLps = calculateAccountValue('stakedAstroLps', account, assets)

  return [deposits, lends, debts, vaults, perps, perpsVault, stakedAstroLps]
}

export const calculateAccountValue = (
  type: 'deposits' | 'lends' | 'debts' | 'vaults' | 'perps' | 'perpsVault' | 'stakedAstroLps',
  account: Account | AccountChange,
  assets: Asset[],
): BigNumber => {
  if (!account[type] || !assets) return BN_ZERO

  if (type === 'vaults') {
    return (
      account.vaults?.reduce((acc, vaultPosition) => {
        return acc
          .plus(vaultPosition.values.primary)
          .plus(vaultPosition.values.secondary)
          .plus(vaultPosition.values.unlocking)
          .plus(vaultPosition.values.unlocked)
      }, BN_ZERO) || BN_ZERO
    )
  }

  if (type === 'perps') {
    return (
      account.perps?.reduce((acc, perpPosition) => {
        acc = acc.plus(getCoinValue(perpPosition.pnl.unrealized.net, assets))
        return acc
      }, BN_ZERO) || BN_ZERO
    )
  }

  if (type === 'perpsVault') {
    if (!account.perpsVault) return BN_ZERO
    const activeAmount = account.perpsVault.active?.amount ?? BN_ZERO
    const unlockingAmount = account.perpsVault.unlocking.reduce(
      (total, unlocking) => total.plus(unlocking.amount),
      BN_ZERO,
    )
    const unlockedAmount = account.perpsVault.unlocked ?? BN_ZERO
    const totalAmount = activeAmount.plus(unlockingAmount).plus(unlockedAmount)

    return getCoinValue(BNCoin.fromDenomAndBigNumber(account.perpsVault.denom, totalAmount), assets)
  }

  return (
    account[type]?.reduce((acc, position) => acc.plus(getCoinValue(position, assets)), BN_ZERO) ??
    BN_ZERO
  )
}

export const calculateAccountApr = (
  account: Account,
  borrowAssetsData: BorrowMarketTableData[],
  lendingAssetsData: LendingMarketTableData[],
  hlsStrategies: HLSStrategy[],
  assets: Asset[],
  vaultAprs: Apr[],
  farmAprs: Apr[],
  isHls?: boolean,
): BigNumber => {
  const depositValue = calculateAccountValue('deposits', account, assets)
  const lendsValue = calculateAccountValue('lends', account, assets)
  const vaultsValue = calculateAccountValue('vaults', account, assets)
  const debtsValue = calculateAccountValue('debts', account, assets)
  const perpsValue = calculateAccountValue('perps', account, assets)
  const stakedAstroLpsValue = calculateAccountValue('stakedAstroLps', account, assets)
  const totalValue = depositValue
    .plus(lendsValue)
    .plus(vaultsValue)
    .plus(perpsValue)
    .plus(stakedAstroLpsValue)
  const totalNetValue = totalValue.minus(debtsValue)

  if (totalNetValue.isLessThanOrEqualTo(0)) return BN_ZERO
  const { vaults, lends, debts, deposits, stakedAstroLps } = account

  let totalDepositsInterestValue = BN_ZERO
  let totalLendsInterestValue = BN_ZERO
  let totalVaultsInterestValue = BN_ZERO
  let totalDebtInterestValue = BN_ZERO
  let totalFarmInterestValue = BN_ZERO

  if (isHls) {
    deposits?.forEach((deposit) => {
      const asset = assets.find(byDenom(deposit.denom))
      if (!asset) return BN_ZERO
      const price = asset.price?.amount ?? BN_ZERO
      const amount = deposit.amount.shiftedBy(-asset.decimals)
      const apy =
        hlsStrategies.find((strategy) => strategy.denoms.deposit === deposit.denom)?.apy || 0

      const positionInterest = amount
        .multipliedBy(price)
        .multipliedBy(convertApyToApr(apy, 365))
        .dividedBy(100)

      totalDepositsInterestValue = totalDepositsInterestValue.plus(positionInterest)
    })
  }

  lends?.forEach((lend) => {
    const asset = assets.find(byDenom(lend.denom))
    if (!asset) return BN_ZERO
    const price = asset.price?.amount ?? BN_ZERO
    const amount = lend.amount.shiftedBy(-asset.decimals)
    const apy = lendingAssetsData.find((lendingAsset) => lendingAsset.asset.denom === lend.denom)
      ?.apy.deposit

    if (!apy) return

    const positionInterest = amount
      .multipliedBy(price)
      .multipliedBy(convertApyToApr(apy, 365))
      .dividedBy(100)
    totalLendsInterestValue = totalLendsInterestValue.plus(positionInterest)
  })

  vaults?.forEach((vault) => {
    const apr = vaultAprs.find((vaultApr) => vaultApr.address === vault.address)?.apr
    if (!apr) return
    const lockedValue = vault.values.primary.plus(vault.values.secondary)
    const positionInterest = lockedValue.multipliedBy(apr).dividedBy(100)
    totalVaultsInterestValue = totalVaultsInterestValue.plus(positionInterest)
  })

  debts?.forEach((debt) => {
    const asset = assets.find(byDenom(debt.denom))
    if (!asset) return BN_ZERO
    const price = asset.price?.amount ?? BN_ZERO
    const amount = debt.amount.shiftedBy(-asset.decimals)
    const apy = borrowAssetsData.find((borrowAsset) => borrowAsset.asset.denom === debt.denom)?.apy
      .borrow

    if (!apy) return

    const positionInterest = amount
      .multipliedBy(price)
      .multipliedBy(convertApyToApr(apy, 365))
      .dividedBy(100)

    totalDebtInterestValue = totalDebtInterestValue.plus(positionInterest)
  })

  stakedAstroLps.forEach((stakedAstroLp) => {
    const farm = farmAprs.find((farmApr) => farmApr.address === stakedAstroLp.denom)
    if (!farm) return
    const farmApr = farm.apr ?? 0
    const farmValue = getCoinValue(stakedAstroLp, assets)
    const positionInterest = farmValue.multipliedBy(farmApr).dividedBy(100)
    totalFarmInterestValue = totalFarmInterestValue.plus(positionInterest)
  })

  const totalInterestValue = totalLendsInterestValue
    .plus(totalVaultsInterestValue)
    .minus(totalDebtInterestValue)
    .plus(totalDepositsInterestValue)
    .plus(totalFarmInterestValue)

  return totalInterestValue.dividedBy(totalNetValue).times(100)
}

export function calculateAccountLeverage(account: Account, assets: Asset[]) {
  // TODO: MP-2307: Include perps positions into account leverage calculation
  const [deposits, lends, debts, vaults, _, __, stakedAstroLps] = getAccountPositionValues(
    account,
    assets,
  )
  const netValue = deposits.plus(lends).plus(vaults).plus(stakedAstroLps).minus(debts)
  return debts.dividedBy(netValue).plus(1)
}

export function getAmount(denom: string, coins: Coin[]): BigNumber {
  return BN(coins.find((asset) => asset.denom === denom)?.amount ?? 0)
}

export function accumulateAmounts(denom: string, coins: BNCoin[]): BigNumber {
  return coins.reduce((acc, coin) => acc.plus(getAmount(denom, [coin.toCoin()])), BN_ZERO)
}

export function convertAccountToPositions(account: Account, assets: Asset[]): Positions {
  const vaults = account.vaults.map(
    (vault) =>
      ({
        vault: {
          address: vault.address,
        },
        amount: {
          locking: {
            locked: vault.amounts.locked.toString(),
            unlocking: [
              {
                id: 0,
                coin: { amount: vault.amounts.unlocking.toString(), denom: vault.denoms.lp },
              },
            ],
          },
        },
      }) as VaultPosition,
  )

  return {
    account_kind: account.kind,
    account_id: account.id,
    debts: account.debts.map((debt) => ({
      shares: '0', // This is not needed, but required by the contract
      amount: debt.amount.toString(),
      denom: debt.denom,
    })),
    deposits: account.deposits.map((deposit) => deposit.toCoin()),
    lends: account.lends.map((lend) => ({
      shares: '0', // This is not needed, but required by the contract
      amount: lend.amount.toString(),
      denom: lend.denom,
    })),
    staked_astro_lps: account.stakedAstroLps?.map((stakedAstroLp) => stakedAstroLp.toCoin()) ?? [],
    perps: account.perps.map((perpPosition) => {
      const perpAsset = assets.find(byDenom(perpPosition.denom))
      const perpAssetDecimals = perpAsset?.decimals ?? PRICE_ORACLE_DECIMALS
      return {
        base_denom: perpPosition.baseDenom,
        current_price: perpPosition.currentPrice.decimalPlaces(perpAssetDecimals).toString(),
        current_exec_price: perpPosition.currentPrice.toString(),
        denom: perpPosition.denom,
        entry_price: perpPosition.entryPrice.decimalPlaces(perpAssetDecimals).toString(),
        entry_exec_price: perpPosition.entryPrice.toString(),
        size: perpPosition.amount.toString() as any,
        unrealized_pnl: {
          accrued_funding: perpPosition.pnl.unrealized.funding.amount
            .integerValue()
            .toString() as any,
          // TODO: There is now a double fee applied. This might be inaccurate (on the conservative side)
          opening_fee: '0' as any,
          closing_fee: perpPosition.pnl.unrealized.fees.amount.integerValue().toString() as any,
          pnl: perpPosition.pnl.unrealized.net.amount.integerValue().toString() as any,
          price_pnl: perpPosition.pnl.unrealized.price.amount.integerValue().toString() as any,
        },
        realized_pnl: {
          // This does not matter for the health calculation
          accrued_funding: perpPosition.pnl.realized.funding.amount.toString() as any,
          closing_fee: '0' as any,
          opening_fee: perpPosition.pnl.realized.fees.amount.toString() as any,
          pnl: perpPosition.pnl.realized.net.amount.toString() as any,
          price_pnl: perpPosition.pnl.realized.price.amount.toString() as any,
        },
      }
    }),
    vaults,
  }
}

export function cloneAccount(account: Account): Account {
  return {
    id: account.id,
    kind: account.kind,
    debts: account.debts.map(
      (debt) =>
        new BNCoin({
          amount: debt.amount.toString(),
          denom: debt.denom,
        }),
    ),
    deposits: account.deposits.map((deposit) => new BNCoin(deposit.toCoin())),
    lends: account.lends.map(
      (lend) =>
        new BNCoin({
          amount: lend.amount.toString(),
          denom: lend.denom,
        }),
    ),
    vaults: account.vaults.map((vault) => ({
      ...vault,
      amounts: {
        locked: vault.amounts.locked,
        unlocking: vault.amounts.unlocking,
        unlocked: vault.amounts.unlocked,
        primary: vault.amounts.primary,
        secondary: vault.amounts.secondary,
      },
      values: {
        primary: vault.values.primary,
        secondary: vault.values.secondary,
        unlocking: vault.values.unlocking,
        unlocked: vault.values.unlocked,
      },
    })),
    stakedAstroLps:
      account.stakedAstroLps?.map((stakedAstroLp) => new BNCoin(stakedAstroLp.toCoin())) ?? [],
    perps: account.perps.map((perpPosition) => ({
      ...perpPosition,
      amount: perpPosition.amount,
      pnl: perpPosition.pnl,
      entryPrice: perpPosition.entryPrice,
      currentPrice: perpPosition.currentPrice,
      tradeDirection: perpPosition.tradeDirection,
    })),
    perpsVault: account.perpsVault
      ? {
          active: account.perpsVault?.active ? { ...account.perpsVault.active } : null,
          denom: account.perpsVault.denom,
          unlocked: account.perpsVault.unlocked,
          unlocking: account.perpsVault.unlocking.map((unlocking) => ({
            amount: unlocking.amount,
            unlocksAt: unlocking.unlocksAt,
          })),
        }
      : null,
  }
}

export function removeDepositsAndLends(account: Account, denom: string) {
  const deposits = account.deposits.filter((deposit) => deposit.denom !== denom)
  const lends = account.lends.filter((lend) => lend.denom !== denom)

  deposits.push(BNCoin.fromDenomAndBigNumber(denom, BN_ZERO))
  lends.push(BNCoin.fromDenomAndBigNumber(denom, BN_ZERO))

  return {
    ...account,
    deposits,
    lends,
  }
}

export function getMergedBalancesForAsset(account: Account, assets: Asset[]) {
  const balances: BNCoin[] = []
  assets.forEach((asset) => {
    const balance = accumulateAmounts(asset.denom, [...account.deposits, ...account.lends])
    balances.push(BNCoin.fromDenomAndBigNumber(asset.denom, balance))
  })
  return balances
}

export function computeHealthGaugePercentage(health: number) {
  const ATTENTION_CUTOFF = 10
  const HEALTHY_CUTOFF = 30
  const HEALTHY_BAR_SIZE = 55
  const UNHEALTHY_BAR_SIZE = 21
  const GAP_SIZE = 3

  if (health > HEALTHY_CUTOFF) {
    const basePercentage = 100 - HEALTHY_BAR_SIZE
    const additionalPercentage =
      ((health - HEALTHY_CUTOFF) / (100 - HEALTHY_CUTOFF)) * HEALTHY_BAR_SIZE
    return 100 - (basePercentage + additionalPercentage + GAP_SIZE)
  }

  if (health > ATTENTION_CUTOFF) {
    const basePercentage = UNHEALTHY_BAR_SIZE
    const additionalPercentage =
      ((health - ATTENTION_CUTOFF) / (HEALTHY_CUTOFF - ATTENTION_CUTOFF)) * UNHEALTHY_BAR_SIZE
    return 100 - (basePercentage + additionalPercentage + GAP_SIZE)
  }

  return 100 - (health / ATTENTION_CUTOFF) * UNHEALTHY_BAR_SIZE
}

export function getAccountSummaryStats(
  account: Account,
  borrowAssets: BorrowMarketTableData[],
  lendingAssets: LendingMarketTableData[],
  hlsStrategies: HLSStrategy[],
  assets: Asset[],
  vaultAprs: Apr[],
  farmAprs: Apr[],
  isHls?: boolean,
) {
  const [deposits, lends, debts, vaults, stakedAstroLps] = getAccountPositionValues(account, assets)
  const positionValue = deposits.plus(lends).plus(vaults).plus(stakedAstroLps)
  const apr = calculateAccountApr(
    account,
    borrowAssets,
    lendingAssets,
    hlsStrategies,
    assets,
    vaultAprs,
    farmAprs,
    isHls,
  )
  const leverage = calculateAccountLeverage(account, assets)

  return {
    positionValue: BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, positionValue),
    debts: BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, debts),
    netWorth: BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, positionValue.minus(debts)),
    apr,
    leverage,
  }
}

export function isAccountEmpty(account: Account) {
  if (account.vaults.length > 0) return false
  if (account.lends.length > 0) return false
  if (account.debts.length > 0) return false
  if (account.deposits.length > 0) return false
  if (account.stakedAstroLps.length > 0) return false
  if (account.perpsVault) return false

  return true
}

export function getAccountNetValue(account: Account, assets: Asset[]) {
  const [deposits, lends, debts, vaults, perps, perpsVault, staked_astro_lps] =
    getAccountPositionValues(account, assets)
  return deposits
    .plus(lends)
    .plus(vaults)
    .plus(perps)
    .plus(perpsVault)
    .plus(staked_astro_lps)
    .minus(debts)
}

export function convertCoinArrayIntoBNCoinArray(coins: Coin[]) {
  const BNCoins = [] as BNCoin[]
  coins.forEach((coin) => {
    if (coin.amount !== '0') BNCoins.push(BNCoin.fromCoin(coin))
  })
  return BNCoins
}
