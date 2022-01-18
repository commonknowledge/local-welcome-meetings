import type { NextApiRequest, NextApiResponse } from 'next'
import assert from 'assert'
import { getSlideshowOptions, SelectOption } from '../../data/slideshow'
import { withSentry } from '@sentry/nextjs'

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ slideshowOptions?: SelectOption[]; error?: any }>,
) {
  try {
    const slideshowOptions = await getSlideshowOptions()
    assert.strict(slideshowOptions, 'Slideshow not found')
    return res.status(200).json({ slideshowOptions })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: String(e) })
  }
}

export default withSentry(handler)
