import Card from 'components/common/Card'
import Text from 'components/common/Text'
import classNames from 'classnames'
import { ReactNode } from 'react'

interface Props {
  title: string | ReactNode
  children: ReactNode
  className?: string
}

export default function ChartCardWrapper(props: Props) {
  const { title, children, className } = props

  return (
    <Card
      className={classNames('w-full', className)}
      contentClassName='px-1 pb-2'
      title={
        <div className='px-4 py-3 flex items-center justify-between font-semibold bg-surface-light'>
          {typeof title === 'string' ? <Text size='sm'>{title}</Text> : title}
        </div>
      }
    >
      {children}
    </Card>
  )
}
