import mongoose from 'mongoose'

const profileSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true, unique:true},
    password: { type: String, required: true },
    monthly_income: { type: Number, default:null},
    monthly_expense: { type: Number, default:null },
    risk_appetite: { type: String,default:'' },
    financial_goal: { type: String, default:'' },
    investment_horizon: { type: Number, default:null }
}) 

const profileModel=mongoose.models.profile || mongoose.model('profile',profileSchema)

export default profileModel