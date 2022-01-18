import { notion } from './notion'
import { env } from './env'
import {
  GetDatabaseResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { Slideshow } from '../components/Slideshow'

export type Page = Extract<
  QueryDatabaseResponse['results'][number],
  { properties: any }
>

export async function getSlides(slideshowName: string): Promise<Array<Page>> {
  const slideshows = await notion.databases.query({
    database_id: env.get('NOTION_SLIDESHOW_DATABASE_ID').required().asString(),
    filter: {
      and: [
        {
          property: 'Slideshow',
          select: {
            equals: slideshowName,
          },
        },
        {
          property: 'Archived',
          checkbox: {
            equals: false,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Order',
        direction: 'ascending',
      },
    ],
  })
  return slideshows.results as Array<Page>
}

type Slideshow = Extract<
  GetDatabaseResponse['properties']['Slideshow'],
  { type: 'select' }
>
export type SelectOption = Slideshow['select']['options'][0]

export async function getSlideshowOptions(): Promise<Array<SelectOption>> {
  const database_id = env
    .get('NOTION_SLIDESHOW_DATABASE_ID')
    .required()
    .asString()
  const result = await notion.databases.retrieve({ database_id })
  return (result.properties.Slideshow as Slideshow).select.options
}
