import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import connectDb from './config/db.js'
import userRouter from './routes/profileRoute.js'
import router from './routes/investmentRoute.js'

//app config
const app=express()
const port=process.env.PORT || 5000
connectDb()

//middleware
app.use(express.json())
app.use(cors())

// NEW: Add this logging middleware at the top
app.use((req, res, next) => {
    console.log(`Request Received: ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api/user',userRouter)
app.use('/api/investment', router)

//api endpoint
app.get('/',(req,res)=>
{
 res.send('Api working great')
})

app.listen(port,()=>console.log("Server Started",port))

