import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import { getAllRooms, useRooms } from '../data/room'
import { Room, RoomPermissionType } from '../types/app'
import RoomList from '../components/Rooms'
import Auth from '../components/Auth'
import { useUser } from '../data/auth'
import { Header, HeaderHeight, Loading } from '../components/Layout'
import { Fragment, useState } from 'react'
import CreateRoomModal from '../components/CreateRoom'
import Link from 'next/link'

type IProps = {
  rooms: Room[]
}

type IQuery = {}

const Home: NextPage<IProps> = ({ rooms }) => {
  const { user, isLoggedIn, profile, permissions, signIn } = useUser()
  const [roomOpen, setRoomOpen] = useState(false)
  const _rooms = useRooms(rooms)

  return (
    <div className='bg-gray-100 min-h-screen w-screen'>
      <Head>
        <title>ADHD Together</title>
        <meta name='description' content='Session rooms for ADHD Together' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />
      <div
        style={{
          display: 'flex',
          width: '100%',
          minHeight: `calc(90vh - ${HeaderHeight}px)`,
          backgroundImage: 'url("/images/hinge.jpg")',
          backgroundPosition: 'center 40%',
          backgroundSize: 'cover',
          justifyContent: 'space-around',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 30,
            paddingRight: 15,
            paddingBottom: 30,
            paddingLeft: 15,
          }}
        >
          <h1
            className='text-7xl'
            style={{
              color: 'white',
              fontWeight: 600,
              textShadow: '0 0 40px #000',
              textAlign: 'center',
            }}
          >
            Let&rsquo;s support each other
          </h1>
          <div
            className='text-2xl text-white'
            style={{
              maxWidth: 480,
              textAlign: 'center',
              marginTop: '2em',
              textShadow: '0 0 40px #000',
            }}
          >
            ADHD Together is a place free from expectations where you can be
            yourself, connect and feel supported.
          </div>
          <a
            target='_blank'
            rel='noreferrer'
            className='bg-adhdPurple text-adhdBlue'
            style={{
              textDecoration: 'none',
              marginTop: 30,
              paddingTop: 10,
              paddingRight: 20,
              paddingBottom: 10,
              paddingLeft: 20,
              borderRadius: 4,
              marginBottom: 30,
            }}
            href='https://brandonjackson.typeform.com/to/JFz8XJjf'
          >
            I&rsquo;m interested!
          </a>
        </div>
      </div>

      <main className='max-w-lg mx-auto py-5 relative space-y-5'>
        <p>
          We&rsquo;re making it fun and easy to meet other people with ADHD.
        </p>
        <p>
          Our 8-week small group courses are designed to be informative and
          relaxed.
        </p>
        <p>They&rsquo;re for people with ADHD, by people with ADHD.</p>
        <p>
          If you&rsquo;re looking for a place where your ADHD brain is
          appreciated, nurtured and celebrated, we&rsquo;d love you to join in.
        </p>

        {user && !profile && <Loading />}
        {isLoggedIn === true ? (
          <>
            {profile?.canManageShifts && (
              <>
                <button className='button' onClick={() => setRoomOpen(true)}>
                  Create room
                </button>
                <CreateRoomModal isOpen={roomOpen} setIsOpen={setRoomOpen} />
              </>
            )}
            {profile != null && (
              <RoomList
                key='rooms'
                rooms={_rooms?.filter((r) => {
                  return (
                    profile?.canManageShifts ||
                    permissions?.some(
                      (p) =>
                        p.type === RoomPermissionType.Lead && p.roomId === r.id,
                    )
                  )
                })}
              />
            )}
          </>
        ) : (
          <button onClick={signIn} className='button'>
            Sign in to manage rooms
          </button>
        )}
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<IProps, IQuery> = async (
  context,
) => {
  return {
    props: {
      rooms: await getAllRooms(),
    },
  }
}

export default Home
