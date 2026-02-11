import jwt from "jsonwebtoken";
import { config } from "dotenv";

config(); //loads environment variables

export const verifyToken = async (req, res, next) => {
  //token verification logic

  //get token from request (using cookie-parser)
  const token = req.cookies.token; // { token: "" }
  console.log("token :", token);

  //if token is not present
  if (token === undefined) {
    return res.status(400).json({ message: "Please login first" });
  }

  //verify token validity (decode token)
  //jwt.verify throws error if token is invalid or expired
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  //forward request to next middleware/route
  next();
};
 