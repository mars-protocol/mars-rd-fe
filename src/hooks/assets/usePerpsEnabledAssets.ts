import useAssets from 'hooks/assets/useAssets'
import { useMemo } from 'react'

export default function usePerpsEnabledAssets() {
  const { data: assets } = useAssets()

  return useMemo(
    () => assets.filter((asset) => asset.isPerpsEnabled && !asset.isDeprecated),
    [assets],
  )
}
