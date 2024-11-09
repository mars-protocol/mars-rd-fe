import Button from 'components/common/Button'
import Text from 'components/common/Text'

interface Props {
  handleRefetch: () => void
}

export default function AreaChartError(props: Props) {
  const { handleRefetch } = props
  return (
    <div className='h-100 w-full flex items-center justify-center'>
      <div className='flex flex-col space-y-1'>
        <Text size='lg'>Error fetching data. Please try again.</Text>
        <Button color='tertiary' onClick={handleRefetch}>
          Retry
        </Button>
      </div>
    </div>
  )
}
