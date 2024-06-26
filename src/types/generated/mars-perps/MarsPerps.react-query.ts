// @ts-nocheck
/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.35.3.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import { UseQueryOptions, useQuery, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate'
import { StdFee } from '@cosmjs/amino'
import {
  OracleBaseForString,
  ParamsBaseForString,
  InstantiateMsg,
  ExecuteMsg,
  OwnerUpdate,
  Decimal,
  Uint128,
  ActionKind,
  SignedUint,
  QueryMsg,
  ConfigForString,
  Accounting,
  Balance,
  CashFlow,
  PnlAmounts,
  DenomStateResponse,
  Funding,
  SignedDecimal,
  ArrayOfDenomStateResponse,
  PerpVaultDeposit,
  TradingFee,
  Coin,
  OwnerResponse,
  PerpDenomState,
  PnlValues,
  NullablePerpVaultPosition,
  PerpVaultPosition,
  PerpVaultUnlock,
  PositionResponse,
  PerpPosition,
  PositionFeesResponse,
  ArrayOfPositionResponse,
  PositionsByAccountResponse,
  ArrayOfPerpVaultUnlock,
  VaultState,
} from './MarsPerps.types'
import { MarsPerpsQueryClient, MarsPerpsClient } from './MarsPerps.client'
export const marsPerpsQueryKeys = {
  contract: [
    {
      contract: 'marsPerps',
    },
  ] as const,
  address: (contractAddress: string | undefined) =>
    [{ ...marsPerpsQueryKeys.contract[0], address: contractAddress }] as const,
  owner: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'owner', args }] as const,
  config: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'config', args }] as const,
  vaultState: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'vault_state', args }] as const,
  denomState: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'denom_state', args }] as const,
  perpDenomState: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'perp_denom_state', args },
    ] as const,
  denomStates: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'denom_states', args }] as const,
  perpVaultPosition: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'perp_vault_position', args },
    ] as const,
  deposit: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'deposit', args }] as const,
  unlocks: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'unlocks', args }] as const,
  position: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'position', args }] as const,
  positions: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'positions', args }] as const,
  positionsByAccount: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'positions_by_account', args },
    ] as const,
  totalPnl: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'total_pnl', args }] as const,
  openingFee: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'opening_fee', args }] as const,
  denomAccounting: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'denom_accounting', args },
    ] as const,
  totalAccounting: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'total_accounting', args },
    ] as const,
  denomRealizedPnlForAccount: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>,
  ) =>
    [
      {
        ...marsPerpsQueryKeys.address(contractAddress)[0],
        method: 'denom_realized_pnl_for_account',
        args,
      },
    ] as const,
  positionFees: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsPerpsQueryKeys.address(contractAddress)[0], method: 'position_fees', args }] as const,
}
export interface MarsPerpsReactQuery<TResponse, TData = TResponse> {
  client: MarsPerpsQueryClient | undefined
  options?: Omit<
    UseQueryOptions<TResponse, Error, TData>,
    "'queryKey' | 'queryFn' | 'initialData'"
  > & {
    initialData?: undefined
  }
}
export interface MarsPerpsPositionFeesQuery<TData>
  extends MarsPerpsReactQuery<PositionFeesResponse, TData> {
  args: {
    accountId: string
    denom: string
    newSize: SignedUint
  }
}
export function useMarsPerpsPositionFeesQuery<TData = PositionFeesResponse>({
  client,
  args,
  options,
}: MarsPerpsPositionFeesQuery<TData>) {
  return useQuery<PositionFeesResponse, Error, TData>(
    marsPerpsQueryKeys.positionFees(client?.contractAddress, args),
    () =>
      client
        ? client.positionFees({
            accountId: args.accountId,
            denom: args.denom,
            newSize: args.newSize,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsDenomRealizedPnlForAccountQuery<TData>
  extends MarsPerpsReactQuery<PnlAmounts, TData> {
  args: {
    accountId: string
    denom: string
  }
}
export function useMarsPerpsDenomRealizedPnlForAccountQuery<TData = PnlAmounts>({
  client,
  args,
  options,
}: MarsPerpsDenomRealizedPnlForAccountQuery<TData>) {
  return useQuery<PnlAmounts, Error, TData>(
    marsPerpsQueryKeys.denomRealizedPnlForAccount(client?.contractAddress, args),
    () =>
      client
        ? client.denomRealizedPnlForAccount({
            accountId: args.accountId,
            denom: args.denom,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsTotalAccountingQuery<TData>
  extends MarsPerpsReactQuery<Accounting, TData> {}
export function useMarsPerpsTotalAccountingQuery<TData = Accounting>({
  client,
  options,
}: MarsPerpsTotalAccountingQuery<TData>) {
  return useQuery<Accounting, Error, TData>(
    marsPerpsQueryKeys.totalAccounting(client?.contractAddress),
    () => (client ? client.totalAccounting() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsDenomAccountingQuery<TData>
  extends MarsPerpsReactQuery<Accounting, TData> {
  args: {
    denom: string
  }
}
export function useMarsPerpsDenomAccountingQuery<TData = Accounting>({
  client,
  args,
  options,
}: MarsPerpsDenomAccountingQuery<TData>) {
  return useQuery<Accounting, Error, TData>(
    marsPerpsQueryKeys.denomAccounting(client?.contractAddress, args),
    () =>
      client
        ? client.denomAccounting({
            denom: args.denom,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsOpeningFeeQuery<TData> extends MarsPerpsReactQuery<TradingFee, TData> {
  args: {
    denom: string
    size: SignedUint
  }
}
export function useMarsPerpsOpeningFeeQuery<TData = TradingFee>({
  client,
  args,
  options,
}: MarsPerpsOpeningFeeQuery<TData>) {
  return useQuery<TradingFee, Error, TData>(
    marsPerpsQueryKeys.openingFee(client?.contractAddress, args),
    () =>
      client
        ? client.openingFee({
            denom: args.denom,
            size: args.size,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsTotalPnlQuery<TData> extends MarsPerpsReactQuery<SignedDecimal, TData> {}
export function useMarsPerpsTotalPnlQuery<TData = SignedDecimal>({
  client,
  options,
}: MarsPerpsTotalPnlQuery<TData>) {
  return useQuery<SignedDecimal, Error, TData>(
    marsPerpsQueryKeys.totalPnl(client?.contractAddress),
    () => (client ? client.totalPnl() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsPositionsByAccountQuery<TData>
  extends MarsPerpsReactQuery<PositionsByAccountResponse, TData> {
  args: {
    accountId: string
    action?: ActionKind
  }
}
export function useMarsPerpsPositionsByAccountQuery<TData = PositionsByAccountResponse>({
  client,
  args,
  options,
}: MarsPerpsPositionsByAccountQuery<TData>) {
  return useQuery<PositionsByAccountResponse, Error, TData>(
    marsPerpsQueryKeys.positionsByAccount(client?.contractAddress, args),
    () =>
      client
        ? client.positionsByAccount({
            accountId: args.accountId,
            action: args.action,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsPositionsQuery<TData>
  extends MarsPerpsReactQuery<ArrayOfPositionResponse, TData> {
  args: {
    limit?: number
    startAfter?: string[][]
  }
}
export function useMarsPerpsPositionsQuery<TData = ArrayOfPositionResponse>({
  client,
  args,
  options,
}: MarsPerpsPositionsQuery<TData>) {
  return useQuery<ArrayOfPositionResponse, Error, TData>(
    marsPerpsQueryKeys.positions(client?.contractAddress, args),
    () =>
      client
        ? client.positions({
            limit: args.limit,
            startAfter: args.startAfter,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsPositionQuery<TData>
  extends MarsPerpsReactQuery<PositionResponse, TData> {
  args: {
    accountId: string
    denom: string
    newSize?: SignedUint
  }
}
export function useMarsPerpsPositionQuery<TData = PositionResponse>({
  client,
  args,
  options,
}: MarsPerpsPositionQuery<TData>) {
  return useQuery<PositionResponse, Error, TData>(
    marsPerpsQueryKeys.position(client?.contractAddress, args),
    () =>
      client
        ? client.position({
            accountId: args.accountId,
            denom: args.denom,
            newSize: args.newSize,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsUnlocksQuery<TData>
  extends MarsPerpsReactQuery<ArrayOfPerpVaultUnlock, TData> {
  args: {
    accountId?: string
    userAddress: string
  }
}
export function useMarsPerpsUnlocksQuery<TData = ArrayOfPerpVaultUnlock>({
  client,
  args,
  options,
}: MarsPerpsUnlocksQuery<TData>) {
  return useQuery<ArrayOfPerpVaultUnlock, Error, TData>(
    marsPerpsQueryKeys.unlocks(client?.contractAddress, args),
    () =>
      client
        ? client.unlocks({
            accountId: args.accountId,
            userAddress: args.userAddress,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsDepositQuery<TData> extends MarsPerpsReactQuery<PerpVaultDeposit, TData> {
  args: {
    accountId?: string
    userAddress: string
  }
}
export function useMarsPerpsDepositQuery<TData = PerpVaultDeposit>({
  client,
  args,
  options,
}: MarsPerpsDepositQuery<TData>) {
  return useQuery<PerpVaultDeposit, Error, TData>(
    marsPerpsQueryKeys.deposit(client?.contractAddress, args),
    () =>
      client
        ? client.deposit({
            accountId: args.accountId,
            userAddress: args.userAddress,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsPerpVaultPositionQuery<TData>
  extends MarsPerpsReactQuery<NullablePerpVaultPosition, TData> {
  args: {
    accountId?: string
    action?: ActionKind
    userAddress: string
  }
}
export function useMarsPerpsPerpVaultPositionQuery<TData = NullablePerpVaultPosition>({
  client,
  args,
  options,
}: MarsPerpsPerpVaultPositionQuery<TData>) {
  return useQuery<NullablePerpVaultPosition, Error, TData>(
    marsPerpsQueryKeys.perpVaultPosition(client?.contractAddress, args),
    () =>
      client
        ? client.perpVaultPosition({
            accountId: args.accountId,
            action: args.action,
            userAddress: args.userAddress,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsDenomStatesQuery<TData>
  extends MarsPerpsReactQuery<ArrayOfDenomStateResponse, TData> {
  args: {
    limit?: number
    startAfter?: string
  }
}
export function useMarsPerpsDenomStatesQuery<TData = ArrayOfDenomStateResponse>({
  client,
  args,
  options,
}: MarsPerpsDenomStatesQuery<TData>) {
  return useQuery<ArrayOfDenomStateResponse, Error, TData>(
    marsPerpsQueryKeys.denomStates(client?.contractAddress, args),
    () =>
      client
        ? client.denomStates({
            limit: args.limit,
            startAfter: args.startAfter,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsPerpDenomStateQuery<TData>
  extends MarsPerpsReactQuery<PerpDenomState, TData> {
  args: {
    denom: string
  }
}
export function useMarsPerpsPerpDenomStateQuery<TData = PerpDenomState>({
  client,
  args,
  options,
}: MarsPerpsPerpDenomStateQuery<TData>) {
  return useQuery<PerpDenomState, Error, TData>(
    marsPerpsQueryKeys.perpDenomState(client?.contractAddress, args),
    () =>
      client
        ? client.perpDenomState({
            denom: args.denom,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsDenomStateQuery<TData>
  extends MarsPerpsReactQuery<DenomStateResponse, TData> {
  args: {
    denom: string
  }
}
export function useMarsPerpsDenomStateQuery<TData = DenomStateResponse>({
  client,
  args,
  options,
}: MarsPerpsDenomStateQuery<TData>) {
  return useQuery<DenomStateResponse, Error, TData>(
    marsPerpsQueryKeys.denomState(client?.contractAddress, args),
    () =>
      client
        ? client.denomState({
            denom: args.denom,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsVaultStateQuery<TData> extends MarsPerpsReactQuery<VaultState, TData> {}
export function useMarsPerpsVaultStateQuery<TData = VaultState>({
  client,
  options,
}: MarsPerpsVaultStateQuery<TData>) {
  return useQuery<VaultState, Error, TData>(
    marsPerpsQueryKeys.vaultState(client?.contractAddress),
    () => (client ? client.vaultState() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsConfigQuery<TData> extends MarsPerpsReactQuery<ConfigForString, TData> {}
export function useMarsPerpsConfigQuery<TData = ConfigForString>({
  client,
  options,
}: MarsPerpsConfigQuery<TData>) {
  return useQuery<ConfigForString, Error, TData>(
    marsPerpsQueryKeys.config(client?.contractAddress),
    () => (client ? client.config() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsOwnerQuery<TData> extends MarsPerpsReactQuery<OwnerResponse, TData> {}
export function useMarsPerpsOwnerQuery<TData = OwnerResponse>({
  client,
  options,
}: MarsPerpsOwnerQuery<TData>) {
  return useQuery<OwnerResponse, Error, TData>(
    marsPerpsQueryKeys.owner(client?.contractAddress),
    () => (client ? client.owner() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsPerpsCloseAllPositionsMutation {
  client: MarsPerpsClient
  msg: {
    accountId: string
    action?: ActionKind
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsPerpsCloseAllPositionsMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsPerpsCloseAllPositionsMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsPerpsCloseAllPositionsMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.closeAllPositions(msg, fee, memo, funds),
    options,
  )
}
export interface MarsPerpsModifyPositionMutation {
  client: MarsPerpsClient
  msg: {
    accountId: string
    denom: string
    newSize: SignedUint
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsPerpsModifyPositionMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsPerpsModifyPositionMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsPerpsModifyPositionMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.modifyPosition(msg, fee, memo, funds),
    options,
  )
}
export interface MarsPerpsClosePositionMutation {
  client: MarsPerpsClient
  msg: {
    accountId: string
    denom: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsPerpsClosePositionMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsPerpsClosePositionMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsPerpsClosePositionMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.closePosition(msg, fee, memo, funds),
    options,
  )
}
export interface MarsPerpsOpenPositionMutation {
  client: MarsPerpsClient
  msg: {
    accountId: string
    denom: string
    size: SignedUint
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsPerpsOpenPositionMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsPerpsOpenPositionMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsPerpsOpenPositionMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.openPosition(msg, fee, memo, funds),
    options,
  )
}
export interface MarsPerpsWithdrawMutation {
  client: MarsPerpsClient
  msg: {
    accountId?: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsPerpsWithdrawMutation(
  options?: Omit<UseMutationOptions<ExecuteResult, Error, MarsPerpsWithdrawMutation>, 'mutationFn'>,
) {
  return useMutation<ExecuteResult, Error, MarsPerpsWithdrawMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.withdraw(msg, fee, memo, funds),
    options,
  )
}
export interface MarsPerpsUnlockMutation {
  client: MarsPerpsClient
  msg: {
    accountId?: string
    shares: Uint128
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsPerpsUnlockMutation(
  options?: Omit<UseMutationOptions<ExecuteResult, Error, MarsPerpsUnlockMutation>, 'mutationFn'>,
) {
  return useMutation<ExecuteResult, Error, MarsPerpsUnlockMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.unlock(msg, fee, memo, funds),
    options,
  )
}
export interface MarsPerpsDepositMutation {
  client: MarsPerpsClient
  msg: {
    accountId?: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsPerpsDepositMutation(
  options?: Omit<UseMutationOptions<ExecuteResult, Error, MarsPerpsDepositMutation>, 'mutationFn'>,
) {
  return useMutation<ExecuteResult, Error, MarsPerpsDepositMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.deposit(msg, fee, memo, funds),
    options,
  )
}
export interface MarsPerpsDisableDenomMutation {
  client: MarsPerpsClient
  msg: {
    denom: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsPerpsDisableDenomMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsPerpsDisableDenomMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsPerpsDisableDenomMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.disableDenom(msg, fee, memo, funds),
    options,
  )
}
export interface MarsPerpsEnableDenomMutation {
  client: MarsPerpsClient
  msg: {
    denom: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsPerpsEnableDenomMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsPerpsEnableDenomMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsPerpsEnableDenomMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.enableDenom(msg, fee, memo, funds),
    options,
  )
}
export interface MarsPerpsInitDenomMutation {
  client: MarsPerpsClient
  msg: {
    denom: string
    maxFundingVelocity: Decimal
    skewScale: Uint128
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsPerpsInitDenomMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsPerpsInitDenomMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsPerpsInitDenomMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.initDenom(msg, fee, memo, funds),
    options,
  )
}
export interface MarsPerpsUpdateOwnerMutation {
  client: MarsPerpsClient
  msg: OwnerUpdate
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsPerpsUpdateOwnerMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsPerpsUpdateOwnerMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsPerpsUpdateOwnerMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.updateOwner(msg, fee, memo, funds),
    options,
  )
}
