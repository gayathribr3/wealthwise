import React,{useContext,useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Login = () => {
   const {backendurl,token,setToken}=useContext(AppContext)
    const navigate=useNavigate()
    const[state,setstate]=useState('Sign up')
    const [email,setemail]=useState('')
    const [password,setpassword]=useState('')
    const [name,setname]=useState('')

  const onSubmitHandler=async(event)=>{
  event.preventDefault() //whenever we will submit the form it will not reload the webpage
  try{
   if(state==='Sign up'){
    const {data}=await axios.post(backendurl+'/api/user/register',{name,password,email})
    if(data.success)
    {
      localStorage.setItem('token',data.token)
      setToken(data.token)
    }
    else{
      toast.error(data.message)
    }
   }
   else{
       const {data}=await axios.post(backendurl+'/api/user/login',{password,email})
    if(data.success)
    {
      localStorage.setItem('token',data.token)
      setToken(data.token)
    }
    else{
      toast.error(data.message)
    }
   }
  }
  catch(error){
  toast.error(error.message)
  }
  }

  useEffect(()=>{
  if(token){
  navigate('/profile')
  }
  },[token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
    <div className='text-zinc-600 text-sm shadow-lg rounded-xl  border border-gray-300 sm:min-w-96 min-w-[340px] p-8 items-start m-auto gap-3 flex-col flex'>
       <p className='text-2xl font-semibold'>{state==='Sign up'? "Create Account":"Login" }</p>
       <p className='tracking-wide'>Please {state==='Sign up'?"sign up":"log in"} to get financial advice</p>
       {
        state==="Sign up" && <div className='w-full'>
        <p>Full Name</p>
        <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setname(e.target.value)} value={name} required />
       </div>
       }
       
       <div className='w-full'>
        <p>Email</p>
        <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setemail(e.target.value)} value={email} required />
       </div>
       <div className='w-full'>
        <p>Password</p>
        <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setpassword(e.target.value)} value={password} required />
       </div>
       <button type='submit' className='bg-green-800 text-white w-full py-2 rounded-md text-base'> {state==='Sign up'? "Create Account":"Login" } </button>
       {
        state==="Sign up"?
        <p className='tracking-wide'>Already have an account? <span onClick={()=>setstate('Login')} className='text-green-800  cursor-pointer underline'> Login here</span></p>
        : <p className='tracking-wide'>Create a new account? <span onClick={()=>setstate('Sign up')}  className='text-green-800 cursor-pointer underline'>Click here</span> </p>
       }
    </div>
   </form>
  )
}

export default Login
