import { StoreApi } from 'zustand'

export default function createModalSlice(
  set: StoreApi<Store>['setState'],
  get: StoreApi<Store>['getState'],
): ModalSlice {
  return {
    resetStettingsModal: false,
    settingsModal: false,
  }
}
