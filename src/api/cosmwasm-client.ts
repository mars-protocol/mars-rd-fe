import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { MarsAccountNftQueryClient } from 'types/generated/mars-account-nft/MarsAccountNft.client'
import { MarsCreditManagerQueryClient } from 'types/generated/mars-credit-manager/MarsCreditManager.client'
import { MarsIncentivesQueryClient } from 'types/generated/mars-incentives/MarsIncentives.client'
import { MarsMockVaultQueryClient } from 'types/generated/mars-mock-vault/MarsMockVault.client'
import { MarsOracleOsmosisQueryClient } from 'types/generated/mars-oracle-osmosis/MarsOracleOsmosis.client'
import { MarsOracleWasmQueryClient } from 'types/generated/mars-oracle-wasm/MarsOracleWasm.client'
import { MarsParamsQueryClient } from 'types/generated/mars-params/MarsParams.client'
import { MarsPerpsQueryClient } from 'types/generated/mars-perps/MarsPerps.client'
import { MarsRedBankQueryClient } from 'types/generated/mars-red-bank/MarsRedBank.client'
import { getUrl } from 'utils/url'

const _cosmWasmClient: Map<string, CosmWasmClient> = new Map()
const _creditManagerQueryClient: Map<string, MarsCreditManagerQueryClient> = new Map()
const _oracleQueryClient: Map<string, MarsOracleOsmosisQueryClient> = new Map()
const _paramsQueryClient: Map<string, MarsParamsQueryClient> = new Map()
const _incentivesQueryClient: Map<string, MarsIncentivesQueryClient> = new Map()
const _perpsClient: Map<string, MarsPerpsQueryClient> = new Map()
const _redBankQueryClient: Map<string, MarsRedBankQueryClient> = new Map()
const _accountNftQueryClient: Map<string, MarsAccountNftQueryClient> = new Map()

const getClient = async (rpc: string) => {
  try {
    if (!_cosmWasmClient.get(rpc)) {
      const client = await CosmWasmClient.connect(rpc)
      _cosmWasmClient.set(rpc, client)
    }

    return _cosmWasmClient.get(rpc)!
  } catch (error) {
    throw error
  }
}

const getCreditManagerQueryClient = async (chainConfig: ChainConfig) => {
  try {
    const contract = chainConfig.contracts.creditManager
    const rpc = getUrl(chainConfig.endpoints.rpc)
    const key = rpc + contract

    if (!_creditManagerQueryClient.get(key)) {
      const client = await getClient(rpc)
      _creditManagerQueryClient.set(key, new MarsCreditManagerQueryClient(client, contract))
    }

    return _creditManagerQueryClient.get(key)!
  } catch (error) {
    throw error
  }
}

const getParamsQueryClient = async (chainConfig: ChainConfig) => {
  try {
    const contract = chainConfig.contracts.params
    const rpc = getUrl(chainConfig.endpoints.rpc)
    const key = rpc + contract

    if (!_paramsQueryClient.get(key)) {
      const client = await getClient(rpc)
      _paramsQueryClient.set(key, new MarsParamsQueryClient(client, contract))
    }

    return _paramsQueryClient.get(key)!
  } catch (error) {
    throw error
  }
}

const getOracleQueryClientOsmosis = async (chainConfig: ChainConfig) => {
  try {
    const contract = chainConfig.contracts.oracle
    const rpc = getUrl(chainConfig.endpoints.rpc)
    const key = rpc + contract

    if (!_oracleQueryClient.get(key)) {
      const client = await getClient(rpc)
      _oracleQueryClient.set(key, new MarsOracleOsmosisQueryClient(client, contract))
    }

    return _oracleQueryClient.get(key)!
  } catch (error) {
    throw error
  }
}

const getOracleQueryClientNeutron = async (chainConfig: ChainConfig) => {
  try {
    const contract = chainConfig.contracts.oracle
    const rpc = getUrl(chainConfig.endpoints.rpc)
    const key = rpc + contract

    if (!_oracleQueryClient.get(key)) {
      const client = await getClient(rpc)
      _oracleQueryClient.set(key, new MarsOracleWasmQueryClient(client, contract))
    }

    return _oracleQueryClient.get(key)!
  } catch (error) {
    throw error
  }
}

const getVaultQueryClient = async (chainConfig: ChainConfig, address: string) => {
  try {
    const client = await getClient(getUrl(chainConfig.endpoints.rpc))
    return new MarsMockVaultQueryClient(client, address)
  } catch (error) {
    throw error
  }
}

const getIncentivesQueryClient = async (chainConfig: ChainConfig) => {
  try {
    const contract = chainConfig.contracts.incentives
    const rpc = getUrl(chainConfig.endpoints.rpc)
    const key = rpc + contract
    if (!_incentivesQueryClient.get(key)) {
      const client = await getClient(rpc)
      _incentivesQueryClient.set(key, new MarsIncentivesQueryClient(client, contract))
    }

    return _incentivesQueryClient.get(key)!
  } catch (error) {
    throw error
  }
}

const getPerpsQueryClient = async (chainConfig: ChainConfig) => {
  try {
    const contract = chainConfig.contracts.perps
    const rpc = getUrl(chainConfig.endpoints.rpc)
    const key = rpc + contract
    if (!_perpsClient.get(key)) {
      const client = await getClient(rpc)
      _perpsClient.set(key, new MarsPerpsQueryClient(client, contract))
    }

    return _perpsClient.get(key)!
  } catch (error) {
    throw error
  }
}

const getRedBankQueryClient = async (chainConfig: ChainConfig) => {
  try {
    const contract = chainConfig.contracts.redBank
    const rpc = getUrl(chainConfig.endpoints.rpc)
    const key = rpc + contract

    if (!_redBankQueryClient.get(key)) {
      const client = await getClient(rpc)
      _redBankQueryClient.set(key, new MarsRedBankQueryClient(client, contract))
    }

    return _redBankQueryClient.get(key)!
  } catch (error) {
    throw error
  }
}

const getAccountNftQueryClient = async (chainConfig: ChainConfig) => {
  try {
    const contract = chainConfig.contracts.accountNft
    const rpc = getUrl(chainConfig.endpoints.rpc)
    const key = rpc + contract

    if (!_accountNftQueryClient.get(key)) {
      const client = await getClient(rpc)
      _accountNftQueryClient.set(key, new MarsAccountNftQueryClient(client, contract))
    }

    return _accountNftQueryClient.get(key)!
  } catch (error) {
    throw error
  }
}

export {
  getClient,
  getCreditManagerQueryClient,
  getIncentivesQueryClient,
  getOracleQueryClientNeutron,
  getOracleQueryClientOsmosis,
  getParamsQueryClient,
  getPerpsQueryClient,
  getRedBankQueryClient,
  getVaultQueryClient,
  getAccountNftQueryClient,
}
