import parseDuration from 'parse-duration'
import * as React from 'react'

interface SetCustomTimeProps {
  setTimer: (newTimer: number) => void
}

const stopPropagation = (e: React.KeyboardEvent) => {
  e.stopPropagation()
}

export const SetCustomTime: React.FunctionComponent<SetCustomTimeProps> = ({
  setTimer,
}) => {
  const [value, setValue] = React.useState<string>('2m30s')

  const onSubmit = React.useCallback(() => {
    setTimer(parseDuration(value) / 1000)
  }, [setTimer, value])

  const onKeyPress = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()
      if (e.nativeEvent.key === 'Enter') {
        onSubmit()
      }
    },
    [onSubmit],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div
        style={{ boxShadow: '0 0 0 1px #fff3 inset' }}
        className={`text-xs text-opacity-80 uppercase font-semibold text-adhdBlue bg-adhdDarkPurple rounded-lg p-1`}
      >
        <input
          className='placeholder-gray-400'
          placeholder='0h0m0s'
          style={{
            height: 20,
            width: '6em',
            borderRadius: 4,
            color: 'white',
            fontSize: 10,
            outline: 'none',
            paddingLeft: 4,
            fontWeight: 600,
            backgroundColor: '#fff4',
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={onKeyPress}
          onKeyDown={stopPropagation}
        />
        <span
          onClick={onSubmit}
          style={{
            cursor: 'pointer',
            marginLeft: 4,
            position: 'relative',
            top: 1,
          }}
          className='hover:text-red-600'
        >
          Set
        </span>
      </div>
    </div>
  )
}
