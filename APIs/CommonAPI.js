import exp from 'express'
import { authenticate } from '../services/authService.js';
import { UserTypeModel } from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
export const commonRouter=exp.Router()

//login 
commonRouter.post("/login",async(req, res)=>{
      //get user credentials
      let userCred = req.body;
    
      //call authenticate service
      let { token, user } = await authenticate(userCred);
    
      //store token as httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, //true in production (HTTPS)
      });
    
      //send response
      res.status(200).json({
        message: "login success",
        payload: user,
      });
    });

//logout
commonRouter.get("/logout",async(req, res)=>{
  //clear the cookie named 'token'
  res.clearCookie('token', {
    httpOnly: true, //should match original cookie settings
    secure: false,
    sameSite: 'lax'
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

//password update (check if the password already exists and if yes, ask the user to enter new password)
// change password (protected route)
commonRouter.put('/change-password', async (req, res) => {
  try {
    //get current & new password
    const { email, password, newPassword } = req.body;

    //basic validation
    if (!password || !newPassword) {
      return res.status(400).json({
        message: "Password and new password are required"
      });
    }

    //find user
    const user = await UserTypeModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    //verify current password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    //check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from old password"
      });
    }

    //hash new password
    const updatedPassword = await bcrypt.hash(newPassword, 10);

    //update password
    await UserTypeModel.findByIdAndUpdate(
      user._id,
      { $set: { password: updatedPassword } }
    );

    res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
