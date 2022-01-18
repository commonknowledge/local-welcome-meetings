import type { NextApiRequest, NextApiResponse } from 'next'
import assert from 'assert'
import { getSlides, Page } from '../../data/slideshow'
import { withSentry } from '@sentry/nextjs'

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ slides?: Page[]; error?: any }>,
) {
  try {
    const { slideshowName } = req.query
    const slides = await getSlides(slideshowName.toString())
    assert.strict(slides, 'Slideshow not found')
    return res.status(200).json({ slides })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: String(e) })
  }
}

export default withSentry(handler)
