import classNames from 'classnames'
import { useState } from 'react'

import Card from 'components/common/Card'

interface Props {
  tabs: CardTab[]
  contentClassName?: string
  className?: string
}

export function CardWithTabs(props: Props) {
  const { className, contentClassName, tabs } = props
  const [activeIdx, setActiveIdx] = useState(0)

  if (props.tabs.length === 0) return null

  return (
    <Card
      title={<Tabs onChange={setActiveIdx} activeIdx={activeIdx} {...props} />}
      className={classNames('w-full', className)}
      contentClassName={contentClassName}
    >
      {tabs[activeIdx].renderContent()}
    </Card>
  )
}

type TabsProps = {
  tabs: CardTab[]
  onChange: (index: number) => void
  activeIdx: number
}

function Tabs(props: TabsProps) {
  const { tabs, activeIdx, onChange } = props
  return (
    <div className='flex gap-6 items-center w-full font-semibold bg-white/10 px-4'>
      {tabs.map((tab, index) => {
        return (
          <button
            key={index}
            className={classNames(
              'py-4 border-b-[2px] border-transparent flex items-center',
              tabs.length < 2 && 'cursor-default text-white border-transparent',
              index === activeIdx && tabs.length > 1 && '!border-martian-red',
              index !== activeIdx && tabs.length > 1 && 'text-white/20',
            )}
            onClick={() => onChange(index)}
          >
            {tab.title}
            <NotificationCount count={tab.notificationCount} />
          </button>
        )
      })}
    </div>
  )
}

interface NotificationCountProps {
  count?: number
}

function NotificationCount(props: NotificationCountProps) {
  const { count } = props
  if (!count) return null

  return <div className='px-1 bg-martian-red text-xs text-white rounded-sm ml-1'>{count}</div>
}
