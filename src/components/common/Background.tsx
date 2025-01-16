import classNames from 'classnames'

export default function Background() {
  return (
    <div
      className={classNames(
        'fixed inset-0',
        'w-screen-full h-screen-full',
        'overflow-hidden pointer-events-none background',
        'bg-body',
        'transition-bg duration-1000 delay-300',
      )}
    >
      <div
        className={classNames(
          'fixed',
          'h-[20vw] w-[20vw]',
          'min-h-[150px] min-w-[150px]',
          'max-h-[500px] max-w-[500px]',
          'left-[-10vw] top-[-10vw]',
          'blur-orb-primary',
          'bg-orb-primary',
          'translate-x-0 translate-y-0 rounded-full opacity-20',
          'animate-[float_120s_ease-in-out_infinite_2s]',
          'transition-bg duration-1000 delay-300',
        )}
      />
      <div
        className={classNames(
          'fixed',
          'h-[40vw] w-[40vw]',
          'min-h-[400px] min-w-[400px]',
          'max-h-[1000px] max-w-[1000px]',
          'bottom-[-20vw] right-[-10vw]',
          'blur-orb-secondary',
          'bg-orb-secondary',
          'translate-x-0 translate-y-0  rounded-full opacity-30',
          'transition-bg duration-1000 delay-300',
        )}
      />
      <div
        className={classNames(
          'fixed',
          'h-[25vw] w-[25vw]',
          'min-h-[120px] min-w-[120px]',
          'max-h-[600px] max-w-[600px]',
          'right-[-4vw] top-[-10vw]',
          'blur-orb-tertiary ',
          'bg-orb-tertiary',
          'translate-x-0 translate-y-0 rounded-full opacity-20',
          'animate-[float_180s_ease-in_infinite]',
          'transition-bg duration-1000 delay-300',
        )}
      />
    </div>
  )
}
