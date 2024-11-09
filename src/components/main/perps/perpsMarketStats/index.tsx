import usePerpsGlobalStats from 'hooks/perps/usePerpsGlobalStats'
import StatisticsPanel from 'components/main/perps/perpsMarketStats/StatisticsPanel'
import DynamicLineChart from 'components/common/Chart/DynamicLineChart'
import TabChart from 'components/main/overview/Chart/TabChart'
import { useMemo } from 'react'
import { mergeDateValueArrays, transformDateValueArray } from 'utils/helpers'

export default function PerpsMarketStats() {
  const { data: perpsGlobalStats } = usePerpsGlobalStats()

  const openInterestData = useMemo(() => {
    if (perpsGlobalStats?.open_interest) {
      // Transform each dataset individually
      const longData = transformDateValueArray(perpsGlobalStats.open_interest.long, 'value1')
      const shortData = transformDateValueArray(perpsGlobalStats.open_interest.short, 'value2')
      const totalData = transformDateValueArray(perpsGlobalStats.open_interest.total, 'value3')

      // Merge the transformed datasets
      return mergeDateValueArrays(longData, shortData, totalData)
    }
    return []
  }, [perpsGlobalStats])

  console.log(openInterestData, 'openInterestData')

  const lineConfigs = [
    { dataKey: 'value1', color: '#AB47BC', name: 'Long' },
    { dataKey: 'value2', color: '#580DA3', name: 'Short' },
    { dataKey: 'value3', color: '#30E0A1', name: 'Total' },
  ]
  return (
    <div className='flex flex-col gap-4'>
      <StatisticsPanel data={perpsGlobalStats} />
      {/* <div className='flex-2 w-full'> */}
      {/* <div className='flex justify-between items-center gap-10'> */}
      {/* <div className='flex-2'> */}
      {/* <PieChartBody /> */}
      <DynamicLineChart data={openInterestData} lines={lineConfigs} height={400} width='100%' />
      {/* </div> */}
      {/* <div className='flex-1 flex flex-col gap-4'>
                    <HorizontalBarChartBody />
                    <HorizontalBarChartBody />
                  </div> */}
      {/* </div> */}
      <div className='flex gap-4 -mt-4'>
        <TabChart />
      </div>
    </div>
    // </div>
  )
}
