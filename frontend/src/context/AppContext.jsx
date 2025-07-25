import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AppContext=createContext()
const AppContextProvider=(props)=>{

    const backendurl=import.meta.env.VITE_BACKEND_URL
    const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userdata,setuserdata]=useState(null)

    const loaduserprofiledata=async()=>{
    try{
    const {data}=await axios.get(backendurl + '/api/user/get-profile',{headers: { Authorization: `Bearer ${token}` }})
        console.log("Fetched user profile from backend:", data);
    if(data.success)
    {
        setuserdata(data.userData)
    }
    else{
        toast.error(data.message)
    }
    }
    catch(error){
     console.log(error)
     toast.error(error.message)
    }
}

    const value={
    token,setToken,backendurl,userdata,setuserdata,loaduserprofiledata
} 

//when we log out, the token will be unavailable
useEffect(()=>{
    console.log("Token changed:", token); // 👈 add this
    if(token){
        loaduserprofiledata()
    }
    else{
        setuserdata(false)
    }
},[token])

return(
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
)
}
export default AppContextProvider
