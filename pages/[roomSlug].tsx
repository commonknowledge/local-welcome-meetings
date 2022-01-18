import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { Meeting } from '../components/Meeting'
import { getRoomBySlug, RoomContextProvider } from '../data/room'
import { getSlides, Page } from '../data/slideshow'
import { Room } from '../types/app'

type IProps = {
  room: Room
  slides: Page[]
}

type IQuery = {
  roomSlug: string
}

const Home: NextPage<IProps> = ({ room, slides }) => {
  return (
    <RoomContextProvider slug={room.slug} initialData={{ room, slides }}>
      <Head>
        <title>{room.name}</title>
        <meta name='description' content='Call link for ADHD Together.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Meeting />
    </RoomContextProvider>
  )
}

export const getServerSideProps: GetServerSideProps<IProps, IQuery> = async ({
  params,
}) => {
  const room = await getRoomBySlug(params!.roomSlug as string)
  if (!room) {
    return {
      props: { room: null as any, slides: [] },
      redirect: { destination: '/user', permanent: false },
    }
  }
  const slides = await getSlides(room.slideshowName)
  return { props: { room, slides: slides || [] } }
}

export default Home
