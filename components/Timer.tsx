import { addSeconds, differenceInMilliseconds, startOfDay } from 'date-fns'
import { format, utcToZonedTime } from 'date-fns-tz'
import React, { useEffect, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { theme } from 'twin.macro'
import { useUser } from '../data/auth'
import { IRoomContext, useRoom } from '../data/room'
import { useServerTime } from '../data/time'
import { down, useMediaQuery } from '../styles/screens'
import { Room } from '../types/app'
import { getTimezone } from '../utils/date'
import { usePrevious } from '../utils/hooks'
import { ShowFor } from './Elements'
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
      isControllable={!profile?.canLeadSessions}
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

export function TimerComponent({
  updateRoom,
  isControllable,
  room,
  durations,
}: {
  isControllable: boolean
  updateRoom: IRoomContext['updateRoom']
  room: Room
  durations: Array<{ duration: number; label: string; className?: string }>
}) {
  const serverTime = useServerTime()
  const [timerFinishedDate, setTimerFinishedDate] = useState<Date | null>(null)

  const isPlaying = room?.timerState === 'playing'

  const previousTimerState = usePrevious(room?.timerState)
  useEffect(() => {
    if (previousTimerState === 'playing' && room?.timerState !== 'playing') {
      setTimerFinishedDate(serverTime.getServerDate())
    }
  }, [room?.timerState, previousTimerState, serverTime])

  const isMobile = useMediaQuery(down('lg'))

  const toggleTimer = () => {
    if (isPlaying) {
      resetTimer()
    } else {
      startTimer()
    }
  }

  const timezone = getTimezone()

  const resetTimer = React.useCallback(() => {
    updateRoom({
      timerState: 'stopped',
      timerStartTime: serverTime.getServerDate() as any,
    })
  }, [serverTime, updateRoom])

  const startTimer = (timerDuration?: number) =>
    updateRoom({
      timerState: 'playing',
      timerStartTime: serverTime.getServerDate() as any,
      timerDuration,
    })

  const startDate = utcToZonedTime(new Date(room.timerStartTime), timezone)
  const now = serverTime.getServerDate()
  const endDate = addSeconds(startDate, room.timerDuration)
  const remainingSeconds =
    Math.max(0, differenceInMilliseconds(endDate, now)) / 1000

  const onTimerComplete = React.useCallback(() => {
    resetTimer()
  }, [resetTimer])

  function sd(seconds: number, duration: number) {
    return Math.min(
      1,
      Math.max(0, Math.abs(Math.min(duration, seconds) / duration)),
    )
  }

  return (
    <>
      <CountdownCircleTimer
        key={JSON.stringify([
          room.timerState,
          room.timerStartTime,
          room.timerDuration,
        ])}
        isPlaying={isPlaying}
        initialRemainingTime={isPlaying ? remainingSeconds : room.timerDuration}
        duration={room.timerDuration}
        size={isMobile ? 160 : 175}
        colors={[
          // [theme`colors.adhdDarkPurple`, sd(0.5, room.timerDuration)],
          [
            theme`colors.adhdBlue`,
            sd(room.timerDuration - 10.5, room.timerDuration),
          ],
          [theme`colors.adhdBlue`, sd(0.5, room.timerDuration)],
          // 10 second countdown
          [theme`colors.red.600`, sd(0.5, room.timerDuration)],
          ['#FFFFFF', sd(0.5, room.timerDuration)],
          [theme`colors.red.600`, sd(0.5, room.timerDuration)],
          ['#FFFFFF', sd(0.5, room.timerDuration)],
          [theme`colors.red.600`, sd(0.5, room.timerDuration)],
          ['#FFFFFF', sd(0.5, room.timerDuration)],
          [theme`colors.red.600`, sd(0.5, room.timerDuration)],
          ['#FFFFFF', sd(0.5, room.timerDuration)],
          [theme`colors.red.600`, sd(0.5, room.timerDuration)],
          ['#FFFFFF', sd(0.5, room.timerDuration)],
          [theme`colors.red.600`, sd(0.5, room.timerDuration)],
          ['#FFFFFF', sd(0.5, room.timerDuration)],
          [theme`colors.red.600`, sd(0.5, room.timerDuration)],
          ['#FFFFFF', sd(0.5, room.timerDuration)],
          [theme`colors.red.600`, sd(0.5, room.timerDuration)],
          ['#FFFFFF', sd(0.5, room.timerDuration)],
          [theme`colors.red.600`, sd(0.5, room.timerDuration)],
          ['#FFFFFF', sd(0.5, room.timerDuration)],
          [theme`colors.red.600`, sd(0.5, room.timerDuration)],
          ['#FFFFFF', sd(0.5, room.timerDuration)],
        ]}
        trailColor={theme`colors.adhdDarkPurple`}
        onComplete={onTimerComplete}
        strokeWidth={20}
      >
        {({ remainingTime, elapsedTime }) => (
          <span className='text-center'>
            {isControllable ? (
              // Member views of timer
              !!isPlaying && !!remainingTime && !!elapsedTime ? (
                <CurrentTime remainingTime={remainingTime} />
              ) : timerFinishedDate != null ? (
                <ShowFor
                  seconds={5}
                  then={<CurrentTime remainingTime={room.timerDuration} />}
                >
                  <div
                    className='uppercase text-sm font-semibold mt-2 cursor-pointer text-adhdBlue bg-adhdDarkPurple rounded-lg p-1'
                    onClick={toggleTimer}
                  >
                    Time Is Up! ✅
                  </div>
                </ShowFor>
              ) : null
            ) : (
              // Leader views of timer
              <>
                {isPlaying && !!remainingTime && !!elapsedTime && (
                  <>
                    <CurrentTime remainingTime={remainingTime} />
                    <div
                      data-attr='timer-stop-early'
                      className='uppercase text-sm font-semibold mt-2 cursor-pointer text-adhdBlue hover:text-red-600 bg-adhdDarkPurple rounded-lg p-1'
                      onClick={toggleTimer}
                    >
                      Stop early
                    </div>
                  </>
                )}
                {!isPlaying && (
                  <div className='space-y-1'>
                    {durations.map(({ duration, label, className }) => (
                      <div
                        data-attr={`timer-start-${duration}`}
                        key={label}
                        onClick={() => startTimer(duration)}
                        className={`${className} uppercase font-semibold cursor-pointer text-adhdBlue hover:text-red-600 bg-adhdDarkPurple rounded-lg p-1`}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </span>
        )}
      </CountdownCircleTimer>
    </>
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
