import React, { useContext } from 'react'
import logo from '../assets/logo.png'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import userprof from '../assets/userprof.png'
import dropdown_icon from '../assets/dropdown_icon.svg'

const Navbar = () => {

    const navigate=useNavigate()
    const {token,setToken}=useContext(AppContext)

    const logout=()=>{
      setToken(false)
      localStorage.removeItem('token')
      navigate('/')
    }

  return (
   <div className='flex font-Outfit items-center justify-between text-sm py-4 mb-4 border-b border-b-gray-400'>
      <img onClick={()=>navigate('/')} className='w-50 object-contain cursor-pointer' src={logo} alt="logo" />
    <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
        <li className='py-0'>Home</li>
        <hr className='border-none outline-none h-0.5 bg-green-500 w-3/5 mx-auto hidden' />
        </NavLink>

        <NavLink>
        <li className='py-0'>About</li>
        <hr className='border-none outline-none h-0.5 bg-green-500 w-3/5 mx-auto hidden' />
        </NavLink>
       
        <li className='py-0'>Contact</li>
        <hr className='border-none outline-none h-0.5 bg-green-500 w-3/5 mx-auto hidden' />
        
        
    </ul>
    <div className='flex items-center gap-4'>
      {
            token? 
            <div className='flex gap-2 items-center cursor-pointer group relative'>
                <img className='rounded-full w-8' src={userprof} alt="" />
                <img className='w-2.5' src={dropdown_icon} alt="" />
                <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                    <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                        <p onClick={()=>navigate('/profile')} className='hover:text-black cursor-pointer'>My profile</p>
                        <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                    </div>
                </div>
            </div>:
    <button onClick={()=>navigate('/login')} className='bg-green-800 text-white px-8 py-3 rounded-full font-medium tracking-wide cursor-pointer  md:block'>Get Started</button>
      }
      </div>
    </div>
  )
}

export default Navbar
