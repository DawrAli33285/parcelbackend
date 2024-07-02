const router=require('express').Router();
const {register,login}=require('../../controllers/admin/auth')
const {dashboard,getUsers,deleteUser,sendMessage,changePassword,getAllTickets}=require('../../controllers/admin/dashboard')
router.post('/admin-register',register)
router.post('/admin-login',login)
router.get('/get-dashobard',dashboard)
router.get('/getUsers',getUsers)
router.get('/delete-user/:id',deleteUser)
router.post('/admin-change-password',changePassword)
router.get('/getAllTickets',getAllTickets)
router.post('/sendMessage',sendMessage )
module.exports=router;
