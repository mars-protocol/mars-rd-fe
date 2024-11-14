import Card from 'components/common/Card'
import Text from 'components/common/Text'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import classNames from 'classnames'
import { ReactNode, useState } from 'react'
import { TIMEFRAME } from 'constants/timeframe'

interface Props {
  title: string | ReactNode
  children: ReactNode
  className?: string
}

export default function ChartCardWrapper(props: Props) {
  const { title, children, className } = props

  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[0])

  return (
    <Card
      className={classNames('w-full bg-black/10', className)}
      contentClassName='px-3 pb-2'
      title={
        <div className='px-4 flex items-center justify-between font-semibold bg-white/10'>
          <Text size='sm'>{title}</Text>
          <TimeframeSelector
            timeframe={TIMEFRAME}
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            size='xs'
          />
        </div>
      }
    >
      {children}
    </Card>
  )
}
