import { StoreApi } from 'zustand'

export default function createModalSlice(
  set: StoreApi<ModalSlice>['setState'],
  get: StoreApi<ModalSlice>['getState'],
) {
  return {
    resetStettingsModal: false,
    settingsModal: false,
  }
}
