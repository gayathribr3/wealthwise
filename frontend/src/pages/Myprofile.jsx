import React,{useState,useContext} from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Myprofile = () => {
    
    const {userdata,setuserdata,token,backendurl,loaduserprofiledata}=useContext(AppContext)
     console.log("Myprofile userdata:", userdata);
    const [isEdit,setisedit]=useState(false)
    const navigate=useNavigate()

     console.log("Is the component in edit mode?", isEdit);

    const updateuserprofiledata=async()=>{
        console.log("1. 'Save Information' function started.")
        
    try{
        console.log("2. Inside 'try' block.")
        const payload = {
        name: userdata?.name || '',
        monthly_income: userdata?.monthly_income || 0,
        monthly_expense: userdata?.monthly_expense || 0,
        risk_appetite: userdata?.risk_appetite || 'Medium',
        financial_goal: userdata?.financial_goal || '',
        investment_horizon: userdata?.investment_horizon || 0,
     }
        
      console.log("3. Payload created successfully:", payload);

    // Let's check the variables for the API call right before we use them
    console.log("4. Checking API call variables -> URL:", backendurl, "| Token:", token);

    if (!backendurl || !token) {
        console.error("Aborting: Backend URL or Token is missing.");
        toast.error("Configuration error: Cannot contact server.");
        return; // Stop the function here
    }

     const {data}=await axios.post(backendurl+'/api/user/update-profile',payload,{headers:{ Authorization: `Bearer ${token}` }})

    // If you don't see this log, the axios call failed.
    console.log("5. API call was successful. Response data:", data);

     if(data.success)
     {
      toast.success(data.message)
      setuserdata(data.userData)
      await loaduserprofiledata()
      setisedit(false)//to come out of edit mode
     }
     else
     {
      toast.error(data.message)
     }
    }
    catch(error){
    console.log(error)
    toast.error(error.message)
    }

  }
  
  if (!userdata) return <p>Loading user data...</p>


  return userdata && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      
     {
        isEdit?
        <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" value={userdata.name} onChange={e=>setuserdata(prev=>({...prev,name:e.target.value}))}/>
        : 
        <p className='text-green-800 text-3xl font-medium max-w-60 mt-4'>{userdata.name}</p>
     }
     <hr className='bg-zinc-400 h-[1px] border-none' />
     <div className='flex gap-2 font-medium text-1xl text-neutral-500 '>
     <p>Email id:</p>
     <p>{userdata.email}</p>
     </div>

     <div>
        <p className='font-medium text-green-800 tracking-wide'>FINANCIAL INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5  mt-3 text-neutral-700 '>
            <p className='font-medium'>Monthly Income:</p>
            {
                isEdit
                ?   <input className='bg-gray-100 max-w-52' type="number" value={userdata.monthly_income || ''} onChange={e=>setuserdata(prev=>({...prev,monthly_income:e.target.value}))}/>
                :
                <p className='text-green-800'>{userdata.monthly_income}</p>     
            }
            <p className='font-medium'>Monthly Expense</p>
             {
                isEdit
                ?   <input className='bg-gray-100 max-w-52' type="number" value={userdata.monthly_expense || ''} onChange={e=>setuserdata(prev=>({...prev,monthly_expense:e.target.value}))}/>
                :
                <p className='text-green-800'>{userdata.monthly_expense}</p>     
            }
            <p className='font-medium'>Risk Apetite</p>
             {
              isEdit?
              <select className='max-w-20 bg-gray-100'onChange={(e)=>setuserdata(prev=>({...prev,risk_appetite:e.target.value}))} value={userdata.risk_appetite}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
             </select>
             :<p className='text-grey-400'>{userdata.risk_appetite}</p>   
            }
            <p className='font-medium'>Financial Goal</p>
             {
                isEdit
                ?   <input className='bg-gray-100 max-w-52' type="text" value={userdata.financial_goal || ''} onChange={e=>setuserdata(prev=>({...prev,financial_goal:e.target.value}))}/>
                :
                <p className='text-green-800'>{userdata.financial_goal}</p>     
            }
            <p className='font-medium'>Investment <br /> Horizon</p>
             {
                isEdit
                ?   <input className='bg-gray-100 max-w-52' type="number" value={userdata.investment_horizon || ''} onChange={e=>setuserdata(prev=>({...prev,investment_horizon:e.target.value}))}/>
                :
                <p className='text-green-800'>{userdata.investment_horizon}</p>     
            }

        </div>
        <div className='mt-10 flex gap-4'>
            {
                isEdit?
                <button className='border font-medium border-green-800 px-8 py-2 rounded-full hover:bg-green-800 hover:text-white transition-all' onClick={updateuserprofiledata}>Save Information</button>:
                <button className='border font-medium  border-green-800 px-8 py-2 rounded-full  hover:bg-green-800 hover:text-white transition-all' onClick={()=>setisedit(true)}>Edit</button>
            }
            {/* 👇 NEW BUTTON HERE 👇 */}
           <button 
           className='border tracking-wide font-medium border-red-600 text-red-600 px-8 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all' 
           onClick={() => navigate('/dashboard')} // Assumes your dashboard route is '/dashboard'
            >
            View Dashboard
            </button>
            <button 
           className='border tracking-wide font-medium border-red-600 text-red-600 px-8 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all' 
           onClick={() => navigate('/chatbot')} // Assumes your dashboard route is '/chatbot'
            >
            Chat with Bot
            </button>
        </div>
     </div>
   
    </div>
  )
}

export default Myprofile
