// @ts-nocheck
/**
 * This file was automatically generated by @cosmwasm/ts-codegen@1.10.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

export interface InstantiateMsg {
  base_denom: string
  custom_init?: WasmOracleCustomInitParams | null
  owner: string
}
export interface WasmOracleCustomInitParams {
  astroport_factory: string
}
export type ExecuteMsg =
  | {
      set_price_source: {
        denom: string
        price_source: WasmPriceSourceForString
      }
    }
  | {
      remove_price_source: {
        denom: string
      }
    }
  | {
      update_owner: OwnerUpdate
    }
  | {
      update_config: {
        base_denom?: string | null
      }
    }
  | {
      custom: WasmOracleCustomExecuteMsg
    }
export type WasmPriceSourceForString =
  | {
      fixed: {
        price: Decimal
      }
    }
  | {
      astroport_spot: {
        pair_address: string
      }
    }
  | {
      astroport_twap: {
        pair_address: string
        tolerance: number
        window_size: number
      }
    }
  | {
      pyth: {
        contract_addr: string
        denom_decimals: number
        max_confidence: Decimal
        max_deviation: Decimal
        max_staleness: number
        price_feed_id: Identifier
      }
    }
  | {
      lsd: {
        redemption_rate: RedemptionRateForString
        transitive_denom: string
        twap: AstroportTwapForString
      }
    }
  | {
      xyk_liquidity_token: {
        pair_address: string
      }
    }
  | {
      pcl_liquidity_token: {
        pair_address: string
      }
    }
  | {
      ss_liquidity_token: {
        pair_address: string
      }
    }
  | {
      slinky: {
        base_symbol: string
        denom_decimals: number
        max_blocks_old: number
      }
    }
export type Decimal = string
export type Identifier = string
export type OwnerUpdate =
  | {
      propose_new_owner: {
        proposed: string
      }
    }
  | 'clear_proposed'
  | 'accept_proposed'
  | 'abolish_owner_role'
  | {
      set_emergency_owner: {
        emergency_owner: string
      }
    }
  | 'clear_emergency_owner'
export type WasmOracleCustomExecuteMsg = {
  record_twap_snapshots: {
    denoms: string[]
  }
}
export interface RedemptionRateForString {
  contract_addr: string
  max_staleness: number
}
export interface AstroportTwapForString {
  pair_address: string
  tolerance: number
  window_size: number
}
export type QueryMsg =
  | {
      config: {}
    }
  | {
      price_source: {
        denom: string
      }
    }
  | {
      price_sources: {
        limit?: number | null
        start_after?: string | null
      }
    }
  | {
      price: {
        denom: string
        kind?: ActionKind | null
      }
    }
  | {
      prices: {
        kind?: ActionKind | null
        limit?: number | null
        start_after?: string | null
      }
    }
  | {
      prices_by_denoms: {
        denoms: string[]
        kind?: ActionKind | null
      }
    }
export type ActionKind = 'default' | 'liquidation'
export interface ConfigResponse {
  base_denom: string
  owner?: string | null
  proposed_new_owner?: string | null
}
export interface PriceResponse {
  denom: string
  price: Decimal
}
export interface PriceSourceResponseForString {
  denom: string
  price_source: string
}
export type ArrayOfPriceSourceResponseForString = PriceSourceResponseForString[]
export type ArrayOfPriceResponse = PriceResponse[]
