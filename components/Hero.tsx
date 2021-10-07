import 'bootstrap/dist/css/bootstrap.css'
import Link from 'next/link'

// First time using TailwindCSS...

export default function Hero() {
    return (
        <div className="relative z-10 max-w-screen-lg xl:max-w-screen-xl mx-auto my-8">
        <div className="px-4 sm:px-6 md:px-8 mb-14 sm:mb-20 xl:mb-8">
        <div className="px-4 sm:px-6 md:px-8 mb-14 sm:mb-20 xl:mb-8">

        <h1 className="text-4xl sm:text-6xl lg:text-7xl leading-none font-extrabold tracking-tight text-gray-900 mt-10 mb-8 sm:mt-14 sm:mb-10">Let's support each other.</h1>
        <p className="max-w-screen-lg text-lg sm:text-2xl sm:leading-10 font-medium mb-10 sm:mb-11">ADHD Together is a new idea from the people at Local Welcome, a charity making it fun and easy for people to cook and eat with refugees in their community.</p>
        <div className="flex flex-wrap space-y-4 sm:space-y-0 sm:space-x-4 text-center">
            <Link href="https://brandonjackson.typeform.com/to/JFz8XJjf"><a target="_blank" className="w-full sm:w-auto flex-none bg-gray-900 hover:bg-gray-700 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200">Get started</a></Link>
        </div>

        </div>
        </div>

 
        </div>
    )
}