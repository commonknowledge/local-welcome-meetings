// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import { loadEnvConfig } from '@next/env'
import './__mocks__/windowMock'
import {configure} from '@testing-library/react'

export default async function init() {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)

  configure({
    testIdAttribute: 'data-attr'
  })
}

init()