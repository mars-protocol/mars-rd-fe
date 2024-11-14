import { useMemo } from 'react'
import { mergeDateValueArrays, transformDateValueArray } from 'utils/helpers'
import get from 'lodash/get'

interface ChartTransformation {
  path: string[]
  targetKey: string
}

export const usePerpsChartDataTransform = (
  data: PerpsGlobalData,
  transformations: ChartTransformation[],
) => {
  return useMemo(() => {
    if (!data) return []

    const transformedArrays = transformations.map(({ path, targetKey }) => {
      const sourceData = get(data, path, [])
      return transformDateValueArray(sourceData, targetKey)
    })

    return mergeDateValueArrays(...transformedArrays)
  }, [data, transformations])
}
