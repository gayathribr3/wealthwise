import validator from 'validator'
import bcrypt from 'bcrypt'
import profileModel from '../models/profileModel.js'
import jwt from 'jsonwebtoken'

//api to register user
const registerUser=async(req,res)=>{
    try{
        const{name,email,password}=req.body
        if(!name || !password || !email){
            return res.json({success:false,message:"Missing Details"})
        }
        if(!validator.isEmail(email))
        {
            return res.json({success:false,message:"Enter a valid email"}) 
        }
        if(password.length<8){
            return res.json({success:false,message:"Enter a strong password"})
        }
        //encrypting password; hashing user password
        const salt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(password,salt)
        //for saving user data in the db, we create an object called userdata
        const userdata={
            name,
            email,
            password:hashedpassword
        }
        //saving in db
        const newuser=new profileModel(userdata)
        const user=await newuser.save()
        //in this user object we will get an _id property that we will use to create a token by which user can login 
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token})

    }
    catch(error){
     console.log(error)
     res.json({success:false,message:error.message})
    }
}

//api for user login
const loginUser=async(req,res)=>{
    try{
      const {email,password}=req.body
      const user=await profileModel.findOne({email})
      if(!user){
       return  res.json({success:false,message:'User does not exist'})
      }
      //if user exists then we have to match with password
      const ismatch=await bcrypt.compare(password,user.password)
      if(ismatch){
        console.log('SECRET USED FOR SIGNING TOKEN:', process.env.JWT_SECRET)
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token})
      }
      else{
        res.json({success:false,message:"Invalid Credentials"})
      }
    }
    catch(error){
     console.log(error)
     res.json({success:false,message:error.message})
    }
}

//api to get user profile data
const getprofile=async(req,res)=>{
    try{
        const userId=req.user.id
        const userData=await profileModel.findOne({_id:userId}).select('-password')
        res.json({success:true,userData})
    }
     catch(error){
     console.log(error)
     res.json({success:false,message:error.message})
    }
}

const updateprofile = async (req, res) => {
     
  try {
    console.log("Data received in req.body:", req.body); 
    const {
      name,
      monthly_income,
      monthly_expense,
      risk_appetite,
      financial_goal,
      investment_horizon,
    } = req.body;

    const userId = req.user.id;

    // Validate data
    if (
      !name ||
      !monthly_income ||
      !monthly_expense ||
      !risk_appetite ||
      !financial_goal ||
      !investment_horizon
    ) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const updatedUser = await profileModel.findByIdAndUpdate(
      userId,
      {
        name,
        monthly_income,
        monthly_expense,
        risk_appetite,
        financial_goal,
        investment_horizon,
      },
      { new: true } // 🔁 This returns the updated document
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated", userData: updatedUser });
  } catch (error) {
    console.log("Error in updateprofile:", error);
    res.json({ success: false, message: error.message });
  }
};


export {registerUser,loginUser,getprofile,updateprofile}


//api to update user profile
//const updateprofile=async(req,res)=>{
  //  try{
    //    const {name,monthly_income,monthly_expense,risk_appetite,financial_goal,investment_horizon}=req.body
      //  const userId = req.user.id;
        //if(!name || !monthly_income || !monthly_expense || !risk_appetite || !financial_goal || !investment_horizon)
        //{
          //  return res.json({success:false,message:"Data Missing"})
        //}
        //await profileModel.findByIdAndUpdate(userId,{name,monthly_income,monthly_expense,risk_appetite,financial_goal,investment_horizon})
        //res.json({success:true, message:"Profile updated"})
    //}
   // catch(error){
   //  console.log(error)
   //  res.json({success:false,message:error.message})
   // }
//}