import React from 'react'
import logo from '../assets/logo.png'
const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-40'>
      <div >
            <img className='mb-5 w-40' src={logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi tempora earum quae ipsum unde a id sunt, corrupti quod temporibus nemo eveniet? Obcaecati, et illo vero accusantium rem quos laborum!</p>
      </div>

      <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
          <li>Home</li>
          <li>About us</li>
          <li>Contact us</li>
          <li>Privacy Policy</li>
          </ul>
         
      </div>

      <div>
         <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
         <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1-212-456-7890</li>
            <li>wealthwise@gmail.com</li>
         </ul>
      </div>
      </div>
      <div className='flex flex-col justify-center items-center'>
         <hr className='w-1/2 border-t border-gray-300'/>
         <p className='py-5 text-sm text-center'>Copyright 2024 @WealthWise All rights reserved</p>
      </div>

    </div>
  )
}

export default Footer
