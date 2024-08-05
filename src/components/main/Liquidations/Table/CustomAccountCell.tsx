import { ExternalLink } from 'components/common/Icons'
import Text from 'components/common/Text'

interface Props {
  value: string
}

export default function CustomAccountCell(props: Props) {
  const { value } = props
  return (
    <div className='flex items-center justify-end space-x-1'>
      <Text size='sm'>#{value}</Text>
      <ExternalLink className='w-3.5 h-3.5 text-white/40 hover:text-inherit hover:cursor-pointer' />
    </div>
  )
}
