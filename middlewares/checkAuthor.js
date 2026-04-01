import { UserTypeModel } from "../models/UserModel.js";

export const checkAuthor = async (req, res, next) => {
  //get author id (from body or params)
  const authorId = req.body?.author || req.params?.authorId;

  //verify author using authorId
  const author = await UserTypeModel.findById(authorId);

  //if author not found
  if (!author) {
    return res.status(401).json({ message: "Invalid author" });
    //401 → not authenticated / invalid credentials
  }

  //if author exists but role is different
  if (author.role !== "AUTHOR") {
    return res.status(403).json({ message: "User is not an author" });
    //403 → authenticated but not authorized
  }

  //if author account is blocked/inactive
  if (!author.isActive) {
    return res
      .status(403)
      .json({ message: "Author account is not active" });
  }

  //if all checks pass, forward request to next middleware/controller
  next();
};
