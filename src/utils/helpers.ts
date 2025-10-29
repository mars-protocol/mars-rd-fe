import BigNumber from 'bignumber.js'
import throttle from 'lodash.throttle'

import { BN_ZERO } from 'constants/math'
import { BNCoin } from 'types/classes/BNCoin'
import { DocURL, WalletID } from 'types/enums'
import { getCoinValue } from 'utils/formatters'

BigNumber.config({ EXPONENTIAL_AT: 1e9 })

export function BN(n: BigNumber.Value) {
  return new BigNumber(n)
}

function getApproximateHourlyInterest(amount: string, borrowRate: number) {
  return BigNumber(borrowRate)
    .dividedBy(24 * 365)
    .multipliedBy(amount)
}

function asyncThrottle<F extends (...args: never[]) => Promise<unknown>>(func: F, wait?: number) {
  const throttled = throttle(
    (
      resolve: (value: unknown) => void,
      reject: (reason?: unknown) => void,
      args: Parameters<F>,
    ) => {
      func(...args)
        .then(resolve)
        .catch(reject)
    },
    wait,
  )
  return (...args: Parameters<F>): ReturnType<F> =>
    new Promise((resolve, reject) => {
      throttled(resolve, reject, args)
    }) as ReturnType<F>
}

function mergeBNCoinArrays(array1: BNCoin[], array2: BNCoin[]) {
  const merged: BNCoin[] = []

  array1.forEach((coin) => {
    merged.push(new BNCoin(coin.toCoin()))
  })

  array2.forEach((coin) => {
    const index = merged.findIndex((i) => i.denom === coin.denom)
    if (index === -1) {
      merged.push(new BNCoin(coin.toCoin()))
    } else {
      merged[index].amount = merged[index].amount.plus(coin.amount)
    }
  })
  return merged
}

function getValueFromBNCoins(coins: BNCoin[], assets: Asset[]): BigNumber {
  let totalValue = BN_ZERO

  coins.forEach((coin) => {
    totalValue = totalValue.plus(getCoinValue(coin, assets))
  })

  return totalValue
}

export function getLeverageFromLTV(ltv: number) {
  return +(1 / (1 - ltv)).toPrecision(2)
}

function getGovernanceUrl(walletId: WalletID) {
  switch (walletId) {
    case WalletID.Station:
      return DocURL.COUNCIL_STATION
    case WalletID.Leap:
      return DocURL.COUNCIL_LEAP
    default:
      return DocURL.COUNCIL_KEPLR
  }
}

export function transformDateValueArray(
  data: DateValue[],
  key: string,
  formatFn?: (value: number) => number,
) {
  return data.map((item) => ({
    date: item.date,
    [key]: formatFn ? formatFn(Number(item.value)) : Number(item.value),
  }))
}

export function mergeDateValueArrays(...arrays: MergedChartData[][]): MergedChartData[] {
  const mergedData: { [date: string]: MergedChartData } = {}

  arrays.forEach((array) => {
    array.forEach((entry) => {
      const date = String(entry.date)
      mergedData[date] ||= { date }
      Object.assign(mergedData[date], entry)
    })
  })

  return Object.values(mergedData)
}
