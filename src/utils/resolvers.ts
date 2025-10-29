import { BN_ZERO } from 'constants/math'
import { BNCoin } from 'types/classes/BNCoin'
import { Positions } from 'types/generated/mars-credit-manager/MarsCreditManager.types'
import {
  AssetParamsBaseForAddr as AssetParams,
  AssetParamsBaseForAddr,
} from 'types/generated/mars-params/MarsParams.types'
import { Market as RedBankMarket } from 'types/generated/mars-red-bank/MarsRedBank.types'
import { BN, getLeverageFromLTV } from 'utils/helpers'
import { convertAprToApy } from 'utils/parsers'
import { getTokenPrice } from 'utils/tokens'

export function resolveMarketResponse(
  asset: Asset,
  marketResponse: RedBankMarket & Partial<Market>,
  assetParamsResponse: AssetParams,
): Market {
  try {
    return {
      asset,
      apy: {
        borrow: convertAprToApy(Number(marketResponse.borrow_rate), 365) * 100,
        deposit: convertAprToApy(Number(marketResponse.liquidity_rate), 365) * 100,
      },
      debt: marketResponse.debt ?? BN_ZERO,
      deposits: marketResponse.deposits ?? BN_ZERO,
      liquidity: marketResponse.liquidity ?? BN_ZERO,
      depositEnabled: assetParamsResponse.red_bank.deposit_enabled,
      borrowEnabled: assetParamsResponse.red_bank.borrow_enabled,
      ltv: {
        max: Number(assetParamsResponse.max_loan_to_value),
        liq: Number(assetParamsResponse.liquidation_threshold),
      },
    }
  } catch (e) {
    return {
      asset,
      apy: {
        borrow: 0,
        deposit: 0,
      },
      debt: BN_ZERO,
      deposits: BN_ZERO,
      liquidity: BN_ZERO,
      depositEnabled: false,
      borrowEnabled: false,
      ltv: {
        max: 0,
        liq: 0,
      },
    }
  }
}

function resolveHLSStrategies(
  type: 'vault' | 'coin',
  assets: AssetParamsBaseForAddr[],
): HLSStrategyNoCap[] {
  const HLSStakingStrategies: HLSStrategyNoCap[] = []

  assets.forEach((asset) => {
    const correlations = asset.credit_manager.hls?.correlations.filter((correlation) => {
      return type in correlation
    })

    let correlatedDenoms: string[] | undefined

    if (type === 'coin') {
      correlatedDenoms = correlations
        ?.map((correlation) => (correlation as { coin: { denom: string } }).coin.denom)
        .filter((denoms) => !denoms.includes('gamm/pool/'))
    } else {
      correlatedDenoms = correlations?.map(
        (correlation) => (correlation as { vault: { addr: string } }).vault.addr,
      )
    }

    if (!correlatedDenoms?.length) return

    correlatedDenoms.forEach((correlatedDenom) =>
      HLSStakingStrategies.push({
        apy: null,
        maxLeverage: getLeverageFromLTV(+asset.credit_manager.hls!.max_loan_to_value),
        maxLTV: +asset.credit_manager.hls!.max_loan_to_value,
        denoms: {
          deposit: correlatedDenom,
          borrow: asset.denom,
        },
      }),
    )
  })
  return HLSStakingStrategies
}

function resolvePerpsPositions(
  perpPositions: Positions['perps'],
  assets: Asset[],
): PerpsPosition[] {
  if (!perpPositions || !perpPositions.length) return []
  const basePrice = getTokenPrice(perpPositions[0].base_denom, assets)

  return perpPositions.map((position) => {
    return {
      type: 'market',
      denom: position.denom,
      baseDenom: position.base_denom,
      amount: BN(position.size as unknown as string), // Amount is negative for SHORT positions
      tradeDirection: BN(position.size as unknown as string).isNegative() ? 'short' : 'long',
      entryPrice: BN(position.entry_exec_price),
      currentPrice: BN(position.current_exec_price),
      pnl: {
        net: BNCoin.fromDenomAndBigNumber(
          position.base_denom,
          BN(position.unrealized_pnl.pnl as unknown as string)
            .div(basePrice)
            .plus(position.realized_pnl.pnl as unknown as string),
        ),
        realized: {
          net: BNCoin.fromDenomAndBigNumber(
            position.base_denom,
            BN(position.realized_pnl.pnl as unknown as string),
          ),
          price: BNCoin.fromDenomAndBigNumber(
            position.base_denom,
            BN(position.realized_pnl.price_pnl as unknown as string),
          ),
          funding: BNCoin.fromDenomAndBigNumber(
            position.base_denom,
            BN(position.realized_pnl.accrued_funding as unknown as string),
          ),
          fees: BNCoin.fromDenomAndBigNumber(
            position.base_denom,
            BN(position.realized_pnl.closing_fee as unknown as string).plus(
              position.realized_pnl.opening_fee as unknown as string,
            ),
          ),
        },
        unrealized: {
          net: BNCoin.fromDenomAndBigNumber(
            position.base_denom,
            BN(position.unrealized_pnl.pnl as unknown as string),
          ),
          price: BNCoin.fromDenomAndBigNumber(
            position.base_denom,
            BN(position.unrealized_pnl.price_pnl as unknown as string),
          ),
          funding: BNCoin.fromDenomAndBigNumber(
            position.base_denom,
            BN(position.unrealized_pnl.accrued_funding as unknown as string),
          ),
          fees: BNCoin.fromDenomAndBigNumber(
            position.base_denom,
            BN(position.unrealized_pnl.closing_fee as unknown as string),
          ),
        },
      },
    }
  })
}

/* PERPS
export function resolvePerpsVaultPositions(
  perpsVaultPositions?: Positions['perp_vault'],
): PerpsVaultPositions | null {
  if (!perpsVaultPositions) return null

  const [unlocking, unlockedAmount] = perpsVaultPositions.unlocks.reduce(
    (prev, curr) => {
      if (curr.cooldown_end * 1000 < Date.now()) {
        prev[1] = prev[1].plus(curr.amount)
        return prev
      }

      prev[0].push(curr)
      return prev
    },
    [[] as PerpVaultUnlock[], BN_ZERO],
  )

  return {
    denom: perpsVaultPositions.denom,
    active: BN(perpsVaultPositions.deposit.amount).isZero()
      ? null
      : {
          amount: BN(perpsVaultPositions.deposit.amount),
          shares: BN(perpsVaultPositions.deposit.shares),
        },
    unlocking: unlocking.map((position) => ({
      amount: BN(position.amount),
      unlocksAt: position.cooldown_end * 1000,
    })),
    unlocked: unlockedAmount.isZero() ? null : unlockedAmount,
  }
}
  */
