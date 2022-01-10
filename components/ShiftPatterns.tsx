import { useState } from 'react'
import {
  ShiftPattern,
  ShiftAllocation,
  Profile,
  ShiftException,
  ShiftExceptionType,
} from '../types/app'
import { useRoom } from '../data/room'
import {
  deleteShiftAllocation,
  deleteShiftPattern,
  useRota,
  calculateShiftPatternStatus,
  deleteShiftException,
  createShiftException,
} from '../data/rota'
import { useUser } from '../data/auth'
import {
  XCircleIcon,
  LoginIcon,
  LogoutIcon,
  EmojiHappyIcon,
  EmojiSadIcon,
} from '@heroicons/react/outline'
import { useCombobox, UseComboboxProps } from 'downshift'
import { Transition } from '@headlessui/react'
import cronRenderer from 'cronstrue'
import { format } from 'date-fns-tz'
import { useForm } from 'react-hook-form'
import cx from 'classnames'
import { isSameDay } from 'date-fns'
import n from 'pluralize'
import useId from '@accessible/use-id'
import { UserAddIcon } from '@heroicons/react/solid'
import { getTimezone, parseCron } from '../utils/date'

export function ShiftPatterns() {
  const rota = useRota()

  return (
    <div className='space-y-5'>
      {rota.shiftPatterns?.map((shiftPattern, index) => {
        return (
          <ShiftPatternAllocations
            key={shiftPattern.id}
            shiftPattern={shiftPattern}
          />
        )
      })}
    </div>
  )
}

export function ShiftPatternAllocations({
  shiftPattern,
}: {
  shiftPattern: ShiftPattern
}) {
  const { profile } = useUser()
  const rota = useRota()

  const allocatedSlots = rota.shiftAllocations
    .filter(({ shiftPatternId }) => shiftPatternId === shiftPattern.id)
    .sort((a, b) => a.id.localeCompare(b.id))

  const { notEnough, justRight, tooMany } = calculateShiftPatternStatus(
    shiftPattern,
    allocatedSlots,
  )
  const schedule = parseCron(shiftPattern.cron, shiftPattern.cronTimezone)
  const nextDate = new Date(schedule.next().toString())

  return (
    <div key={shiftPattern.id} className=''>
      <h3 className='text-2xl font-bold text-adhdPurple mb-2'>
        {shiftPattern.name}
      </h3>
      <section className='space-y-2 mb-4'>
        <p>
          Sessions run at{' '}
          {cronRenderer
            .toString(shiftPattern.cron, { use24HourTimeFormat: false })
            .replace(/^At/, '')}{' '}
          ({shiftPattern.cronTimezone} time). Next session is{' '}
          <b>
            {format(nextDate, 'h:mm a, do MMMM (zzz)', {
              timeZone: getTimezone(),
            })}
            .
          </b>
        </p>
        {shiftPattern.allowOneOffAllocations && (
          <p>Leaders can sign up for one-off sessions.</p>
        )}
      </section>
      <div
        className={`font-bold uppercase flex justify-between w-full text-sm ${
          notEnough
            ? 'text-red-500'
            : tooMany
            ? 'text-yellow-600'
            : 'text-green-500'
        }`}
      >
        <span>
          {allocatedSlots.length} /{' '}
          {n('leader slot', shiftPattern.required_people, true)} filled
        </span>
        <span>
          {justRight ? (
            <EmojiHappyIcon className='w-[25px] h-[25px]' />
          ) : (
            <EmojiSadIcon className='w-[25px] h-[25px]' />
          )}
        </span>
      </div>
      <div className='space-y-2 my-2'>
        {new Array(
          Math.max(shiftPattern.required_people, allocatedSlots.length),
        )
          .fill(0)
          .map((_, i) => {
            return (
              <ShiftAllocationEditor
                key={
                  (allocatedSlots?.[i]?.profileId || i.toString()) +
                  JSON.stringify(rota.roomLeaders)
                }
                shiftAllocation={allocatedSlots[i]}
                shiftPattern={shiftPattern}
                options={rota.roomLeaders}
              />
            )
          })}
      </div>
      {profile?.canManageShifts && (
        <div
          className='button'
          onClick={() => deleteShiftPattern(shiftPattern.id)}
        >
          Delete shift pattern
        </div>
      )}
    </div>
  )
}

/*
<div key={i} className='border border-dashed border-gray-400 rounded-lg p-3 hover:bg-gray-50 transition'>
  Fill vacant slot {allocatedSlots.length + i + 1}
</div>
*/

export const itemToString = (o: Profile | null) =>
  o
    ? o.firstName
      ? `${o.firstName?.trim()} ${o.lastName?.trim() || ''}`
      : o.email
    : 'Unfilled slot'

export function ShiftAllocationEditor({
  shiftPattern,
  options,
  shiftAllocation,
  editable = true,
  date,
  shiftException: _shiftException,
  label,
  placeholder = 'Fill this slot (repeating dates)',
}: {
  shiftPattern: ShiftPattern
  options: Profile[]
  shiftAllocation?: ShiftAllocation
  editable?: boolean
  date?: Date
  shiftException?: ShiftException
  label?: string
  placeholder?: string
}) {
  const rota = useRota()
  const [inputItems, setInputItems] = useState<Profile[]>(options)
  const [savedDataState, setDataState] = useState<
    null | 'loading' | 'saved' | 'error'
  >(null)

  // If an explicit shift exception has been provided,
  // then we are dealing with a date-specific exception (likely a fill-in)
  const shiftException = _shiftException
    ? _shiftException
    : // Else if a date and an allocation have been provided,
    // see if this allocation, on this date, has been excepted
    date && shiftAllocation
    ? rota.shiftExceptions.find(
        (se) =>
          isSameDay(new Date(se.date), date) &&
          se.profileId === shiftAllocation.profileId &&
          se.type === ShiftExceptionType.DropOut,
      )
    : // Else there's no shift exception to speak of!
      null

  const selectedItem = options.find(
    (o) =>
      o.id === shiftAllocation?.profileId || o.id === shiftException?.profileId,
  )

  const comboProps: UseComboboxProps<Profile> = {
    initialSelectedItem: selectedItem,
    items: inputItems,
    itemToString,
    onInputValueChange: ({ inputValue }) => {
      editable &&
        setInputItems(
          !inputValue?.length
            ? options
            : options.filter((profile) => {
                const inShiftPatternAlready = !!rota.shiftAllocations.find(
                  (sa) =>
                    sa.shiftPatternId === shiftPattern.id &&
                    sa.profileId === profile.id,
                )
                if (inShiftPatternAlready) return false
                const matchesInputValue =
                  profile.email
                    ?.toLowerCase()
                    .startsWith(inputValue?.toLowerCase() || '') ||
                  profile.firstName
                    ?.toLowerCase()
                    .startsWith(inputValue?.toLowerCase() || '') ||
                  profile.lastName
                    ?.toLowerCase()
                    .startsWith(inputValue?.toLowerCase() || '')
                return matchesInputValue
              }),
        )
    },
    onSelectedItemChange: async ({ selectedItem: profile }) => {
      if (profile && editable) {
        try {
          setDataState('loading')
          if (!date) {
            const nextShiftAllocation = {
              shiftPatternId: shiftPattern.id,
              profileId: profile.id,
            }
            if (
              shiftAllocation &&
              shiftAllocation?.shiftPatternId ===
                nextShiftAllocation.shiftPatternId &&
              shiftAllocation?.profileId === nextShiftAllocation.profileId
            ) {
              // It's identical. Do nothing.
            } else if (shiftAllocation) {
              await deleteShiftAllocation(shiftAllocation.id)
              await rota.createShiftAllocation(nextShiftAllocation)
            } else {
              await rota.createShiftAllocation(nextShiftAllocation)
            }
          } else {
            // Add for just this date
            await rota.createShiftException({
              profileId: profile.id,
              shiftPatternId: shiftPattern.id,
              // @ts-ignore
              date,
              type: ShiftExceptionType.FillIn,
            })
          }
          setDataState('saved')
        } catch (e) {
          setDataState('error')
        }
      }
    },
  }

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    reset,
  } = useCombobox<Profile>(comboProps)

  function deleteAllocation() {
    reset()
    if (shiftAllocation) {
      deleteShiftAllocation(shiftAllocation.id)
    }
  }

  async function removeException() {
    if (shiftException) {
      await deleteShiftException(shiftException.id)
    }
  }

  async function dropOut() {
    if (shiftAllocation) {
      await createShiftException({
        profileId: shiftAllocation.profileId,
        shiftPatternId: shiftAllocation.shiftPatternId,
        shiftAllocationId: shiftAllocation.id,
        // @ts-ignore
        date,
        type: ShiftExceptionType.DropOut,
      })
    }
  }

  const id = useId(undefined, 'sp-input-')

  return (
    <div className='relative'>
      <label
        htmlFor={id}
        className={cx(
          'flex flex-row justify-start focus-within:outline-black border rounded-lg hover:bg-gray-50 transition p-2',
          !selectedItem && 'border-dashed border-gray-400',
          selectedItem && 'bg-white shadow-sm',
        )}
      >
        <div
          {...getComboboxProps()}
          className={'w-full flex flex-row justify-start'}
        >
          <button
            {...getToggleButtonProps()}
            className={cx(
              'text-left w-full inline-flex flex-row justify-start border-0 outline-none bg-none hover:bg-none',
              editable ? 'cursor-text' : 'cursor-pointer',
            )}
          >
            {selectedItem && (
              <span className='mr-1'>
                <Avatar
                  profile={selectedItem}
                  disabled={shiftException?.type === ShiftExceptionType.DropOut}
                />
              </span>
            )}
            <div
              className={cx(
                'ml-1 flex flex-col justify-center items-start flex-grow-0 flex-shrink min-h-[43px] w-full',
                editable && 'cursor-text',
              )}
            >
              <input
                {...getInputProps()}
                id={id}
                disabled={!editable}
                placeholder={placeholder}
                className={cx(
                  'w-full border-none rounded-md font-semibold bg-transparent outline-none text-gray-800',
                  shiftException?.type === ShiftExceptionType.DropOut &&
                    'line-through text-opacity-60',
                )}
              />
              {shiftException?.type === ShiftExceptionType.DropOut && (
                <div className='text-red-500 text-xs uppercase font-semibold'>
                  Dropped out
                </div>
              )}
              {shiftException?.type === ShiftExceptionType.FillIn && (
                <div className='text-green-500 text-xs uppercase font-semibold'>
                  Filling in
                </div>
              )}
              {label && (
                <div className='text-gray-500 text-xs uppercase font-semibold'>
                  {label}
                </div>
              )}
            </div>
          </button>
          <div className='pl-2 ml-auto flex flex-row justify-end space-x-2 items-center flex-shrink-0'>
            {!selectedItem && (
              <UserAddIcon className='w-[25px] h-25px] inline-block text-gray-500' />
            )}
            {shiftException?.type === ShiftExceptionType.DropOut && (
              <div
                onClick={(e) => {
                  e.preventDefault()
                  removeException()
                }}
                className='button p-1 uppercase text-xs'
              >
                Back in{' '}
                <LoginIcon className='w-4 h-4 text-inherit inline ml-[3px]' />
              </div>
            )}
            {!!date && shiftException?.type === ShiftExceptionType.FillIn && (
              <div
                onClick={(e) => {
                  e.preventDefault()
                  removeException()
                }}
                className='button p-1 uppercase text-xs'
              >
                Remove{' '}
                <XCircleIcon className='w-4 h-4 text-inherit inline ml-[3px]' />
              </div>
            )}
            {!!date && !!shiftAllocation && !shiftException && (
              <div
                onClick={(e) => {
                  e.preventDefault()
                  dropOut()
                }}
                className='button p-1 uppercase text-xs'
              >
                Drop out{' '}
                <LogoutIcon className='w-4 h-4 text-inherit inline ml-[3px]' />
              </div>
            )}
            {shiftAllocation && editable && (
              <div
                onClick={(e) => {
                  e.preventDefault()
                  deleteAllocation()
                }}
                className='button p-1 uppercase text-xs'
              >
                Remove{' '}
                <XCircleIcon className='w-4 h-4 text-inherit inline ml-[3px]' />
              </div>
            )}
          </div>
        </div>
      </label>
      <Transition
        appear={true}
        show={editable && isOpen}
        enter='transition-opacity duration-75'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-300'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
        className='max-h-[50vh] overflow-y-auto space-y-1 border border-gray-400 rounded-lg p-1 shadow-md absolute top-[100%] z-50 w-full bg-white'
      >
        {!inputItems.length && (
          <div className='flex flex-row justify-start items-center px-3 pt-1 rounded-lg'>
            <Avatar />
            <span className='border-none rounded-md font-semibold'>
              0 leaders found
            </span>
          </div>
        )}
        <ul {...getMenuProps()}>
          {inputItems.map((item, index) => (
            <li
              className={cx(
                'flex flex-row justify-start items-center p-1 rounded-lg',
                highlightedIndex === index && 'bg-yellow-100',
              )}
              key={item.id}
              {...getItemProps({ item, index })}
            >
              <Avatar profile={item} />
              <span className='px-2 border-none rounded-md font-semibold cursor-pointer'>
                {itemToString(item)}
              </span>
            </li>
          ))}
        </ul>
      </Transition>
    </div>
  )
}

export function Avatar({
  profile,
  disabled,
}: {
  profile?: Profile
  disabled?: boolean
}) {
  return (
    <span
      className={cx(
        'w-[43px] h-[43px] rounded-full overflow-hidden flex justify-center items-center flex-shrink-0',
        disabled && profile
          ? 'bg-gray-100 text-gray-500'
          : profile
          ? 'bg-adhdBlue'
          : '',
      )}
    >
      {profile && (
        <span className='text-base font-semibold'>
          {profile?.firstName
            ? `${profile?.firstName?.[0]}${profile?.lastName?.[0]}`
            : profile.email[0]}
        </span>
      )}
    </span>
  )
}

export function CreateShiftPattern() {
  const { room } = useRoom()
  const rota = useRota()

  const defaultValues: Omit<ShiftPattern, 'id' | 'updatedAt'> = {
    roomId: room?.id!,
    name: '',
    required_people: 2,
    cron: '30 18 * * WED#1',
    allowOneOffAllocations: false,
    cronTimezone: getTimezone(),
  }

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues,
  })

  const onSubmit = async (data: typeof defaultValues) => {
    if (data.roomId === null) {
      throw new Error('No room was available')
    }
    await rota.createShiftPattern(data)
    reset()
  }

  const cron = watch('cron')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='shadow overflow-hidden sm:rounded-md'>
        <div className='p-4 sm:p-5 bg-white'>
          <h3 className='text-2xl mb-4 text-left'>Add a shift pattern</h3>
          <div className='grid grid-flow-row gap-2'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Name of shift pattern
              </label>
              <input
                required
                type='text'
                {...register('name')}
                id='name'
                className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              />
            </div>

            <div>
              <label
                htmlFor='required_people'
                className='block text-sm font-medium text-gray-700'
              >
                Number of required people
              </label>
              <input
                required
                type='number'
                min={1}
                max={100}
                {...register('required_people')}
                id='required_people'
                className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              />
            </div>

            <div className='flex items-start'>
              <div className='flex items-center h-5'>
                <input
                  id='allowOneOffAllocations'
                  {...register('allowOneOffAllocations')}
                  type='checkbox'
                  className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
                />
              </div>
              <div className='ml-3 text-sm'>
                <label
                  htmlFor='allowOneOffAllocations'
                  className='font-medium text-gray-700'
                >
                  Allow one-off leader signups
                </label>
                <p className='text-gray-500'>
                  When ticked, leaders can sign up for specific dates that are
                  under-staffed. When unticked, leaders can only fill in when
                  someone drops out of their regular shift.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor='cron'
                className='block text-sm font-medium text-gray-700'
              >
                Chronological pattern
              </label>
              <input
                required
                type='text'
                {...register('cron', {
                  validate: (value) =>
                    !!value &&
                    (!!cronRenderer.toString(value).length ||
                      'Not a valid cron string'),
                })}
                id='cron'
                className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              />
              <section className='space-y-2 p-3 bg-gray-50 rounded-lg'>
                <p>
                  <CronExplainer cron={cron} />
                </p>
                <p>
                  <a
                    className='underline text-blue-500'
                    href='https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions'
                  >
                    Syntax explainer.
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
        <div className='px-4 py-3 bg-gray-50 text-right sm:px-5'>
          <button
            type='submit'
            className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Create shift pattern
          </button>
        </div>
      </div>
    </form>
  )
}

function CronExplainer({ cron }: { cron: string }) {
  try {
    const explainer = cronRenderer.toString(cron)
    return <span>{explainer}</span>
  } catch (e) {
    return <span>Not a valid cron</span>
  }
}
