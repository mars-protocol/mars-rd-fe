import classNames from 'classnames'
import Text from 'components/common/Text'
import moment from 'moment'
import React from 'react'

interface Props {
  active?: boolean
  payload: []
  label: string
  renderContent: (payload: ChartDataPayloadProps[]) => React.ReactNode
}

export default function CustomTooltip(props: Props) {
  const { active, payload, label, renderContent } = props

  const formatDateLabel = (label: string) => {
    const date = moment(label)
    return date.isValid() ? date.format('DD MMM YYYY') : label
  }

  if (active && payload && payload.length) {
    return (
      <div className={classNames('isolate px-4 py-2 backdrop-blur max-w-[320px] bg-black/5')}>
        <Text size='sm' className='text-white/60'>
          {formatDateLabel(label)}
        </Text>
        {renderContent(payload)}
      </div>
    )
  }

  return null
}
