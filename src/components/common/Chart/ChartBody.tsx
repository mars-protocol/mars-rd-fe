import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import ChartTooltip from 'components/common/Chart/Tooltip/ChartTooltip'
import DisplayCurrency from 'components/common/DisplayCurrency'
import moment from 'moment'
import Text from 'components/common/Text'
import useLocalStorage from 'hooks/localStorage/useLocalStorage'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BNCoin } from 'types/classes/BNCoin'
import { DEFAULT_SETTINGS } from 'constants/defaultSettings'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import { formatValue } from 'utils/formatters'
import { ORACLE_DENOM } from 'constants/oracle'

interface Props {
  data: ChartData
  height?: string
}

function TooltipContent(props: TooltipContentProps) {
  const { payload } = props
  const amount = Number(payload[0].value) ?? 0
  const label = payload[0].payload.label ?? 'Value'
  const value = BNCoin.fromDenomAndBigNumber(ORACLE_DENOM, new BigNumber(amount))

  return (
    <div className='flex space-x-1'>
      <Text size='xs'>{label}: </Text>
      <DisplayCurrency coin={value} className='text-xs' />
    </div>
  )
}

export default function ChartBody(props: Props) {
  const [reduceMotion] = useLocalStorage<boolean>(
    LocalStorageKeys.REDUCE_MOTION,
    DEFAULT_SETTINGS.reduceMotion,
  )
  const height = props.height ?? 'h-100'

  return (
    <div className={classNames('-ml-5', height)}>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={props.data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id='chartGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor={'#AB47BC'} stopOpacity={0.3} />
              <stop offset='100%' stopColor={'#AB47BC'} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            horizontal={false}
            stroke='rgba(255,255,255,0.1)'
            strokeDasharray='6 3'
            syncWithTicks={true}
          />
          <XAxis
            stroke='rgba(255, 255, 255, 0.4)'
            tickFormatter={(value) => {
              return moment(value).format('DD MMM')
            }}
            padding={{ left: 5, right: 10 }}
            axisLine={false}
            tickLine={false}
            fontSize={12}
            dataKey='date'
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            fontSize={12}
            tickCount={8}
            stroke='rgba(255, 255, 255, 0.4)'
            tickFormatter={(value) => {
              return formatValue(value, {
                minDecimals: 0,
                maxDecimals: 0,
                prefix: '$',
                abbreviated: true,
              })
            }}
          />
          <Tooltip
            cursor={false}
            isAnimationActive={!reduceMotion}
            wrapperStyle={{ outline: 'none' }}
            content={
              <ChartTooltip
                payload={[]}
                label={''}
                renderContent={(payload) => <TooltipContent payload={payload} />}
              />
            }
          />
          <Area
            type='monotone'
            dataKey='value'
            stroke='#AB47BC'
            fill='url(#chartGradient)'
            isAnimationActive={!reduceMotion}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
