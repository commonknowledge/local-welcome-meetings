import { addSeconds, differenceInMilliseconds, startOfDay } from 'date-fns'
import { format } from 'date-fns-tz'
import React, { useMemo } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useTimeout } from 'rooks'
import { theme } from 'twin.macro'
import { useUser } from '../data/auth'
import { IRoomContext, useRoom } from '../data/room'
import { useServerTime } from '../data/time'
import { down, useMediaQuery } from '../styles/screens'
import { Room } from '../types/app'
import { Loading } from './Layout'

export function Timer() {
  const { profile } = useUser()
  const { room, updateRoom } = useRoom()
  const serverTime = useServerTime()

  if (!room || !serverTime.connectionEstablished) return <Loading />

  return (
    <TimerComponent
      room={room}
      updateRoom={updateRoom}
      isControllable={profile?.canLeadSessions ?? false}
      durations={[
        { duration: 60, label: '1 min', className: 'text-xs text-opacity-80' },
        { duration: 90, label: '1:30', className: 'text-base font-bold' },
        {
          duration: 30,
          label: '30 secs',
          className: 'text-xs text-opacity-80',
        },
      ]}
    />
  )
}

type ColorHex = `#${string}`
const adhdBlue: ColorHex = theme`colors.adhdBlue`
const red: ColorHex = theme`colors.red.600`
const white = '#fff'

const redWhiteFlash = (secondsLength: number): Array<ColorHex> =>
  new Array(secondsLength * 2 + 1)
    .fill(undefined)
    .map((_, i) => (i % 2 === 0 ? red : white))
const flashTimes = (secondsLength: number) =>
  new Array(secondsLength * 2 + 2)
    .fill(undefined)
    .map((_, i) => secondsLength + 0.5 - i * 0.5)

interface TimerComponentProps {
  isControllable: boolean
  updateRoom: IRoomContext['updateRoom']
  room: Room
  durations: Array<{ duration: number; label: string; className?: string }>
}

export const TimerComponent: React.FunctionComponent<TimerComponentProps> = ({
  updateRoom,
  isControllable,
  room: { timerState, timerEndTimeUTC, timerDuration },
  durations,
}) => {
  const isPlaying = timerState === 'playing'

  const { start, clear } = useTimeout(() => {
    updateRoom({
      timerState: 'stopped',
    })
  }, 5000)

  const isMobile = useMediaQuery(down('lg'))

  const onComplete = React.useCallback(() => {
    updateRoom({
      timerState: 'hidden',
      timerEndTimeUTC: undefined,
      timerDuration: undefined,
    })
    start()
  }, [start, updateRoom])

  const setTimer = React.useCallback(
    (timerDurationSeconds: number) => {
      clear()
      updateRoom({
        timerState: 'playing',
        timerEndTimeUTC: addSeconds(
          Date.now(),
          timerDurationSeconds,
        ).toISOString(),
        timerDuration: timerDurationSeconds,
      })
    },
    [clear, updateRoom],
  )

  const secondsRemaining = useMemo(
    () =>
      timerEndTimeUTC != null
        ? differenceInMilliseconds(
            new Date(timerEndTimeUTC),
            new Date(new Date(Date.now()).toISOString()),
          ) / 1000
        : undefined,
    [timerEndTimeUTC],
  )

  return (
    <CountdownCircleTimer
      key={JSON.stringify([timerState, timerEndTimeUTC, timerDuration])}
      isPlaying={isPlaying}
      initialRemainingTime={isPlaying ? secondsRemaining : undefined}
      duration={timerDuration ?? Infinity}
      size={isMobile ? 160 : 175}
      colors={[adhdBlue, adhdBlue, ...redWhiteFlash(10)]}
      colorsTime={[timerDuration, ...flashTimes(10)] as any}
      trailColor={theme`colors.adhdDarkPurple`}
      onComplete={onComplete}
      strokeWidth={20}
    >
      {({ remainingTime }) => (
        <span className='text-center'>
          {(() => {
            switch (timerState) {
              case 'hidden': {
                return (
                  <div className='uppercase text-sm font-semibold mt-2 cursor-pointer text-adhdBlue bg-adhdDarkPurple rounded-lg p-1'>
                    Time Is Up! ✅
                  </div>
                )
              }
              case 'playing': {
                return (
                  <>
                    <CurrentTime remainingTime={remainingTime} />
                    {isControllable && (
                      <div
                        data-attr='timer-stop-early'
                        className='uppercase text-sm font-semibold mt-2 cursor-pointer text-adhdBlue hover:text-red-600 bg-adhdDarkPurple rounded-lg p-1'
                        onClick={onComplete}
                      >
                        Stop early
                      </div>
                    )}
                  </>
                )
              }
              case 'stopped': {
                return (
                  isControllable && (
                    <div className='space-y-1'>
                      {durations.map(({ duration, label, className }) => (
                        <div
                          data-attr={`timer-start-${duration}`}
                          key={label}
                          onClick={() => setTimer(duration)}
                          className={`${className} uppercase font-semibold cursor-pointer text-adhdBlue hover:text-red-600 bg-adhdDarkPurple rounded-lg p-1`}
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  )
                )
              }
            }
          })()}
        </span>
      )}
    </CountdownCircleTimer>
  )
}

const CurrentTime = ({ remainingTime }: { remainingTime: number }) => {
  const serverTime = useServerTime()
  return (
    <div className='text-4xl' data-attr='timer-seconds-remaining'>
      {format(
        addSeconds(startOfDay(serverTime.getServerDate()), remainingTime),
        'm:ss',
      )}
    </div>
  )
}
