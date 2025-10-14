import classNames from 'classnames'
import { Search } from 'components/common/Icons'
import { ChangeEvent, InputHTMLAttributes } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  className?: string
  inputClassName?: string
}

export default function SearchBar({ value, onChange, className, inputClassName, ...props }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div
      className={classNames(
        'flex items-center gap-2 px-3 py-2 bg-surface border border-white/10 rounded-sm',
        'focus-within:border-white/20 transition-colors',
        className,
      )}
    >
      <Search className='w-4 h-4 text-white/40 flex-shrink-0' />
      <input
        type='text'
        value={value}
        onChange={handleChange}
        className={classNames(
          'bg-transparent text-sm text-white placeholder:text-white/40',
          'outline-none w-full',
          inputClassName,
        )}
        {...props}
      />
    </div>
  )
}
