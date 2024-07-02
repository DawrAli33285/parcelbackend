let adminmodel=require('../../models/Admin')
let bcrypt=require('bcryptjs')


module.exports.register=async(req,res)=>{
let {email,password}=req.body;


try{
    let encryptedPassword=await bcrypt.hash(password,10)
     await adminmodel.create({
        email,
        password:encryptedPassword
     })
     return res.status(200).json({
        message:"Sucessfully created"
     })

}catch(error){
    console.log(error.message)
    return res.status(400).json({
        error:"Error please try again"
    })
}
}




module.exports.login=async(req,res)=>{
    
    let {email,password}=req.body;
    try{
let emailfound=await adminmodel.findOne({email})

if(!emailfound){
    return res.status(400).json({
        error:"Account not found"
    })
}
let passwordMatch=await bcrypt.compare(password,emailfound.password)

if(!passwordMatch){
    return res.status(400).json({
        error:"Invalid password"
    })
}
return res.status(200).json({
    user:emailfound
})


    }catch(error){
        console.log(error.message)
        return res.status(400).json({
            error:"Error please try again"
        })
    }
}