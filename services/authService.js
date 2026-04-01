import jwt from "jsonwebtoken"; //for token generation (encryption/signing)
import bcrypt from "bcryptjs"; //for hashing passwords
import { UserTypeModel } from "../models/UserModel.js";
import { config } from "dotenv";

config(); //loads environment variables into process.env

//register function
export const register = async (userObj) => {
  //create a mongoose document
  const userDoc = new UserTypeModel(userObj);

  //validate() works only on documents and throws error if validation fails
  await userDoc.validate();

  //hash and replace plain password
  userDoc.password = await bcrypt.hash(userDoc.password, 10);

  //save document to DB
  const created = await userDoc.save();

  //convert mongoose document to plain JS object
  const newUserObj = created.toObject();

  //remove password before sending to frontend
  delete newUserObj.password;

  //return user object without password
  return newUserObj;
};

//authenticate (login) function
export const authenticate = async ({ email, password }) => {
  //check user existence using email and role
  const user = await UserTypeModel.findOne({ email });

  if (!user) {
    const err = new Error("Invalid email");
    //services cannot send response directly, so we throw errors
    err.status = 401; //frontend can easily catch status-based errors
    throw err;
  }

  //if user exists but may be blocked by admin (future logic here)
  if(user.isActive === false){
    const err = new Error("Your account has been blocked, please contact admin")
    err.status = 403;
    throw err
  }


  //compare entered password with hashed password in DB
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }

//check isActive state and send a message saying you have been blocked


  //generate JWT token
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  //convert document to object to remove password
  const userObj = user.toObject();
  delete userObj.password;

  //return token and user data
  return { token, user: userObj };
};

