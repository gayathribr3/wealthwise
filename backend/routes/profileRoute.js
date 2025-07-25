import express from 'express'
import { getprofile, loginUser, registerUser, updateprofile } from '../controllers/profileController.js'
import authUser from '../middlewares/authUser.js'


//creating instance of router
const userRouter=express.Router()
//api creation using router; endpoint to register the user
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getprofile)
userRouter.post('/update-profile', authUser, updateprofile)


export default userRouter