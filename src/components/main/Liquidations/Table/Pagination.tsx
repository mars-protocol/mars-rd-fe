import Button from 'components/common/Button'
import Text from 'components/common/Text'

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (newPage: number) => void
}

export default function Pagination(props: Props) {
  const { currentPage, totalPages, onPageChange } = props

  return (
    <div className='flex justify-end mt-2'>
      <div className='text-right'>
        <div className='flex space-x-2'>
          {currentPage > 1 && (
            <Button
              variant='solid'
              color='tertiary'
              text='First'
              size='sm'
              onClick={() => onPageChange(1)}
            />
          )}
          <Button
            variant='solid'
            color='tertiary'
            text='Prev'
            size='sm'
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          <Button
            variant='solid'
            color='tertiary'
            text='Next'
            size='sm'
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          {currentPage < totalPages && (
            <Button
              variant='solid'
              color='tertiary'
              text='Last'
              size='sm'
              onClick={() => onPageChange(totalPages)}
            />
          )}
        </div>
        <Text size='xs' className='mt-2'>
          Page {currentPage} of {totalPages}
        </Text>
      </div>
    </div>
  )
}
