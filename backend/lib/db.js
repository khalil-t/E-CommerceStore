import mongoose from "mongoose"

export const connectDB=async ()=>{
try{

const connect =await mongoose.connect(process.env.MONGODB_URI)
console.log(`MongoDB connected`)
}catch(error){
console.log("Error connecting to MongoDB", error.massage)
process.exit(1)
}


}