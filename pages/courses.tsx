import { Header, Loading } from '../components/Layout';
import Head from 'next/head'


export default function Courses() {
    return (
        <>
            <Head>
                <title>ADHD Together: Our Courses</title>
                <meta name="description" content="Session rooms for ADHD Together" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header/>
            <div className="my-8 mx-8">
                <span className="text-4xl sm:text-6xl lg:text-7xl leading-none font-extrabold tracking-tight text-gray-900 mt-10 mb-8 sm:mt-14 sm:mb-10">Our Courses</span>
                <p>TODO</p>
            </div>
        </>
    )
}