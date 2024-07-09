import classNames from 'classnames'
import Card from 'components/common/Card'
import ChartBody from 'components/common/Chart/ChartBody'
import ChartLoading from 'components/common/Chart/ChartLoading'

interface Props {
  data: ChartData | null
  title: string
  height?: string
  className?: string
}

export default function Chart(props: Props) {
  return (
    <Card
      className={classNames('w-full', props.className)}
      title={props.title}
      contentClassName='p-4 pr-0'
    >
      {props.data === null ? (
        <ChartLoading height={props.height} />
      ) : (
        <ChartBody height={props.height} data={props.data} />
      )}
    </Card>
  )
}
