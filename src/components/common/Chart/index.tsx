import classNames from 'classnames'
import Card from 'components/common/Card'
import ChartBody from 'components/common/Chart/ChartBody'
import ChartLoading from 'components/common/Chart/ChartLoading'

interface Props {
  data: ChartData | null
  title?: string
  height?: string
  className?: string
}

export default function Chart(props: Props) {
  return (
    <Card
      className={classNames('w-full', props.className)}
      title={props.title}
      contentClassName='px-2 py-5'
    >
      {props.data === null ? (
        <ChartLoading height={props.height} />
      ) : (
        <ChartBody height={props.height} data={props.data} />
      )}
    </Card>
  )
}
