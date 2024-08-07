import Button from 'components/common/Button'
import Text from 'components/common/Text'

export default function Pagination() {
  return (
    <div className='flex justify-end'>
      <div className='text-right'>
        <div className='flex space-x-2'>
          <Button variant='solid' color='tertiary' text={'Prev'} size='sm' />
          <Button variant='solid' color='tertiary' text={'Next'} size='sm' />
        </div>
        <Text size='xs' className='mt-2'>
          Page 3 out of 10
        </Text>
      </div>
    </div>
  )
}
