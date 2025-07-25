import React from 'react'
import headers from '../assets/headers.png'
import arrow from '../assets/arrow.png'
import icons from '../assets/icons.png'
const Header = () => {
  return (
    
    <div className='flex flex-col md:flex-row flex-wrap bg-green-800 rounded-lg px-6 md:px-10 lg:px-20'>
        <div className='md-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
            <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading tight md:leading-tight lg-leading-tight'>AI-Powered Investment<br />Tailored Solutions</p>
            <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                <img className='w-28' src={icons} alt="" />
                <p>Personalized investment advice, powered by smart AI decisions<br className='hidden sm:block' />Let’s Get Started !</p>
            </div>
            <a className='flex items-center gap-4 bg-white px-7 py-3 rounded-full text-gray-600 text-m m-auto md:m-0 hover:scale-105 transition-all duration-300 ' href="#speciality">
                Create Account <img className='w-6' src={arrow} alt="" />
            </a>
        </div>
        <div className='md:w-1/2 relative'>
            <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={headers} alt="" />
        </div>
      

    </div>
  )
}

export default Header
