import classNames from 'classnames'
import { Cross, Search } from 'components/common/Icons'
import { ChangeEvent, InputHTMLAttributes } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  className?: string
  label?: string
}

export default function SearchBar({ value, onChange, className, label, ...props }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    onChange('')
  }

  return (
    <div
      className={classNames(
        'relative flex items-center gap-2 px-3 py-2 bg-surface-dark border border-white/10 rounded-sm',
        'focus-within:border-white/20 transition-colors',
        className,
      )}
    >
      <div className='relative w-full'>
        <input
          type='text'
          value={value}
          onChange={handleChange}
          placeholder=' '
          className='peer bg-transparent text-sm text-white placeholder:text-white/40 outline-none w-full'
          {...props}
        />
        {label && (
          <label
            className={classNames(
              'absolute left-0 text-sm text-white/40 pointer-events-none',
              'transition-transform duration-150 ease-in-out',
              'peer-focus:-translate-y-1/2 peer-focus:scale-[0.8] peer-focus:-top-2 peer-focus:bg-surface-dark peer-focus:px-1',
              'peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:scale-[0.8] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:bg-surface-dark peer-[:not(:placeholder-shown)]:px-1',
            )}
          >
            {label}
          </label>
        )}
      </div>
      {value ? (
        <button
          onClick={handleClear}
          className='w-3 h-3 text-white/40 hover:text-white/60 flex-shrink-0 transition-colors'
          type='button'
        >
          <Cross className='w-3 h-3' />
        </button>
      ) : (
        <Search className='w-4 h-4 text-white/40 flex-shrink-0' />
      )}
    </div>
  )
}
