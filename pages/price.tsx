import type { NextPage } from 'next'
import Head from 'next/head'
import { Room } from '../types/app';
import PriceForm from '../components/PriceForm';
import { Logo } from '../components/Branding';
import { HeroHeader, Loading } from '../components/Layout';

type IProps = {
  rooms: Room[]
}

const Home: NextPage<IProps> = ({ rooms }) => {
  return (
    <div className='bg-cover w-full h-full min-h-screen w-screen' style={{backgroundImage: "url('https://images.squarespace-cdn.com/content/v1/57aed7ec59cc68f15750d291/1584397756816-GBZKTT3DIN6EKU9HOEC6/Layer+10.png')"}}>
      <Head>
        <title>Course offerings - ADHD Together</title>
        <meta name="description" content="Session rooms for ADHD Together" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeroHeader />

      <main className='max-w-lg mx-auto py-5 relative space-y-5'>
        <PriceForm />
      </main>
    </div>
  )
}

export default Home
