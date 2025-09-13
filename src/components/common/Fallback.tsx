import { CircularProgress } from 'components/common/CircularProgress'

export default function Fallback() {
  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <CircularProgress size={32} />
    </div>
  )
}
