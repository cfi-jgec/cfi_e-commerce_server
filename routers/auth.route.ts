import express from 'express';
import authentication from '../middleware/authentication';
import { adminLogin, allUsers, createUser, getUserDetails, resendOtp, updatePassword, updateUserDetails, userLogin, userLogout, verifyOtp } from '../controllers/auth.controller';
const router = express.Router();

router.route('/admin/login').post(adminLogin);
router.route('/user/login').post(userLogin);
router.route('/logout').get(userLogout); 
router.route('/user/register').post(createUser);
router.route('/otp/resend').patch(resendOtp);
router.route('/otp/verify').patch(verifyOtp);
router.route('/user/update-password').patch(updatePassword);
router.route('/user/:userId').get(authentication, getUserDetails);
router.route('/user/:userId').patch(authentication, updateUserDetails);
router.route('/users').get(authentication, allUsers);

export default router;