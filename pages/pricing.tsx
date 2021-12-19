import * as React from 'react'
import type { NextPage } from 'next'
import { Header } from '../components/Layout'
import CurrencyInput from 'react-currency-input-field'

type IProps = {}

const Pricing: NextPage<IProps> = () => {
  const [salary, setSalary] = React.useState<number>(0)
  const [sessions, setSessions] = React.useState<number>(4)
  const [price, setPrice] = React.useState<number | null>(null)

  const calculate = React.useCallback(() => {
    const pricePerSession = 40000 > salary ? 10 : 20
    setPrice(pricePerSession * sessions)
  }, [salary, sessions])

  const onSalaryValueChange = React.useCallback((value) => {
    const salaryAsNumber = Number(value)
    if (!isNaN(salaryAsNumber)) {
      setSalary(salaryAsNumber)
    }
  }, [])

  const onSessionsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const sessionsAsNumber = Number(e.target.value)
      if (!isNaN(sessionsAsNumber)) {
        setSessions(sessionsAsNumber)
      }
    },
    [],
  )

  return (
    <div className='bg-gray-100 min-h-screen w-screen'>
      <Header />
      <main className='max-w-lg mx-auto py-5 relative space-y-5'>
        <h1 className='text-4xl'>Course price calculator</h1>
        <div style={{ flexDirection: 'column' }}>
          <div>Annual salary</div>
          <CurrencyInput
            id='input-example'
            name='input-name'
            decimalsLimit={0}
            value={salary}
            defaultValue={0}
            prefix='£'
            onValueChange={onSalaryValueChange}
          />
        </div>
        <div style={{ flexDirection: 'column' }}>
          <div>Number of sessions</div>
          <input type='number' value={sessions} onChange={onSessionsChange} />
          <div style={{ fontStyle: 'italic', color: 'gray' }}>
            We normally recommend four sessions to start with.
          </div>
        </div>
        <button
          className='bg-adhdPurple text-adhdBlue'
          style={{
            paddingTop: 10,
            paddingRight: 20,
            paddingBottom: 10,
            paddingLeft: 20,
            borderRadius: 4,
          }}
          onClick={() => calculate()}
        >
          Calculate
        </button>
        {price != null && (
          <div>
            Your total price: <span style={{ fontWeight: 600 }}>£{price}</span>{' '}
            for <span style={{ fontWeight: 600 }}>{sessions}</span> sessions.
          </div>
        )}
      </main>
    </div>
  )
}

export default Pricing
