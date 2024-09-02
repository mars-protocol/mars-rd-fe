import { ExternalLink } from 'components/common/Icons'
import Text from 'components/common/Text'
import { TextLink } from 'components/common/TextLink'

interface Props {
  value: string
}

export default function Account(props: Props) {
  const { value } = props
  const url = `https://app.marsprotocol.io/wallets/osmosiswallet/portfolio/${value}`

  return (
    <div
      className='flex items-center justify-end space-x-1'
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Text size='sm'>#{value}</Text>
      <TextLink href={url} target='_blank' title={`Mars Protocol Account ID #${value}`}>
        <ExternalLink className='w-3.5 h-3.5 text-white/40 hover:text-inherit hover:cursor-pointer' />
      </TextLink>
    </div>
  )
}
