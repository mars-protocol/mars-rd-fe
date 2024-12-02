import Button from 'components/common/Button'
import Text from 'components/common/Text'
import useClipboard from 'react-use-clipboard'
import { Chain, Check } from 'components/common/Icons'
import { Tooltip } from 'components/common/Tooltip'
import { truncate } from 'utils/formatters'

interface Props {
  value: string
}

export default function Transaction(props: Props) {
  const { value } = props

  const [isCopied, setCopied] = useClipboard(value, {
    successDuration: 1000 * 5,
  })

  return (
    <div className='flex items-center justify-end gap-2'>
      <Text size='sm'> {truncate(value, [5, 5])}</Text>
      <Tooltip
        type='info'
        content={<Text size='2xs'>{isCopied ? 'Hash copied!' : 'Copy Hash'}</Text>}
      >
        <Button
          color='quaternary'
          variant='transparent'
          iconClassName='w-3.5 h-3.5'
          className='!px-2'
          leftIcon={isCopied ? <Check /> : <Chain />}
          onClick={setCopied}
        />
      </Tooltip>
    </div>
  )
}
