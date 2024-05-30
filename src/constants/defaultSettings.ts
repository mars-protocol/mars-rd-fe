import { ORACLE_DENOM } from 'constants/oracle'
import useStore from 'store'

// This does not retrigger when chains are switched. Assets might not be present on the new chain, but
// This scenario is still caught.
const defaultTradingPair = useStore.getState().chainConfig.defaultTradingPair

export const DEFAULT_SETTINGS: Settings = {
  reduceMotion: false,
  displayCurrency: ORACLE_DENOM,
  theme: 'default',
  perpsAsset: '',
}
