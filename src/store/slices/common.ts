import { StoreApi } from 'zustand'

import Neutron1 from 'chains/neutron/neutron-1'

export default function createCommonSlice(
  set: StoreApi<CommonSlice>['setState'],
  get: StoreApi<CommonSlice>['getState'],
) {
  return {
    accounts: null,
    balances: [],
    chainConfig: Neutron1,
    creditAccounts: null,
    hlsAccounts: null,
    isOpen: true,
    selectedAccount: null,
    focusComponent: null,
    mobileNavExpanded: false,
    accountDetailsExpanded: false,
    migrationBanner: true,
    tutorial: true,
    useMargin: true,
    useAutoRepay: true,
    isOracleStale: false,
    isHLS: false,
    isV1: false,
    assets: [],
  }
}
