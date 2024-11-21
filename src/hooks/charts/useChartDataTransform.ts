import { useMemo } from 'react'
import { mergeDateValueArrays, transformDateValueArray } from 'utils/helpers'
import get from 'lodash/get'

interface ChartTransformation {
  path: string[]
  targetKey: string
  formatFn?: (value: number) => number
}

export const useChartDataTransform = (
  data: PerpsGlobalData | PerpsMarketData,
  transformations: ChartTransformation[],
) => {
  return useMemo(() => {
    if (!data) return []

    const transformedArrays = transformations.map(({ path, targetKey, formatFn }) => {
      const sourceData = get(data, path, [])
      return transformDateValueArray(sourceData, targetKey, formatFn)
    })

    return mergeDateValueArrays(...transformedArrays)
  }, [data, transformations])
}
