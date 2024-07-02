let userModel=require('../../models/User')
let orderModel=require('../../models/Order')
const bcrypt=require('bcryptjs')
const ticketModel=require('../../models/Ticket')
const moment = require('moment');

module.exports.dashboard = async (req, res) => {
    try {
      // Fetch user registration data grouped by month
      const users = await userModel.aggregate([
        {
          $group: {
            _id: { month: { $month: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            count: 1
          }
        },
        {
          $sort: { month: 1 }
        }
      ]);
  
      // Fetch total sales data grouped by month
      const totalSales = await orderModel.aggregate([
        {$match:{paid:true}},
        {
          $group: {
            _id: { month: { $month: "$createdAt" } },
            totalSales: { $sum: "$rate" }
          }
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            totalSales: 1
          }
        },
        {
          $sort: { month: 1 }
        }
      ]);
  
      // Calculate total amount paid (sum of rate for paid orders)
      const totalAmountPaidResult = await orderModel.aggregate([
        {
          $match: { paid: true }
        },
        {
          $group: {
            _id: null,
            totalAmountPaid: { $sum: "$rate" }
          }
        },
        {
          $project: {
            _id: 0,
            totalAmountPaid: 1
          }
        }
      ]);
  
      const totalAmountPaid = totalAmountPaidResult.length > 0 ? totalAmountPaidResult[0].totalAmountPaid : 0;
      const currentMonthStart = moment().startOf('month');
      const currentMonthEnd = moment().endOf('month');
  
      const salesThisMonthResult = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: currentMonthStart.toDate(),
              $lte: currentMonthEnd.toDate()
            },
paid:true
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$rate" }
          }
        },
        {
          $project: {
            _id: 0,
            totalRevenue: 1
          }
        }
      ]);
  
      const salesThisMonth = salesThisMonthResult.length > 0 ? salesThisMonthResult[0].totalRevenue : 0;
console.log(salesThisMonth)  
console.log(salesThisMonthResult)
     
   
      return res.status(200).json({
        users,
        totalSales,
        totalAmountPaid,
         salesThisMonthResult 
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return res.status(400).json({
        error: "Please try again"
      });
    }
  };


  module.exports.getUsers=async(req,res)=>{
    try{
let users=await userModel.find({})
return res.status(200).json({
    users
})
    }catch(error){
        console.error("Error fetching dashboard data:", error);
        return res.status(400).json({
          error: "Please try again"
        });
    }
  }


  module.exports.deleteUser=async(req,res)=>{
let {id}=req.params;
    try{
 await userModel.deleteOne({_id:id})
 return res.status(200).json({
    message:"sucessfully deleted"
 })
}catch(error){
    console.error("Error fetching dashboard data:", error);
    return res.status(400).json({
      error: "Please try again"
    });
}
  }

  module.exports.changePassword = async (req, res) => {
    const { password, id } = req.body;
  
    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user's password based on _id
      await userModel.updateOne({ _id: id }, { $set: { password: hashedPassword } });
  
      return res.status(200).json({
        message: "Successfully changed password"
      });
    } catch (error) {
      console.error("Error changing password:", error.message);
      return res.status(400).json({
        error: "Failed to change password. Please try again."
      });
    }
  };


  module.exports.getAllTickets=async(req,res)=>{
    try{
let tickets=await ticketModel.find({})
return res.status(200).json({
    tickets
})
    }catch(error){
        console.error("Error changing password:", error.message);
        return res.status(400).json({
          error: "Failed to change password. Please try again."
        });
    }
  }
  





  module.exports.sendMessage = async (req, res, next) => {
   let {user,ticketId,message}=req.body;
    try {
        await ticketModel.findOneAndUpdate(
            {
              _id: ticketId,
              state: 'pending',
              user: user
            },
            {
              $push: {
                chat: {
                  message: message,
                  sender: 'admin',
                  sentAt: new Date()
                }
              }
            }
          )
          return res.status(200).json({
            message:"SUCESS"
          })
    } catch (err) {
      return next(err)
    }
  }
  