import { Schema, model } from "mongoose";

//user schema (structure of user document)
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"], //mandatory field
    },
    lastName: {
      type: String, //optional field
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already existed"], //prevents duplicate emails
    },
    password: {
      type: String,
      required: [true, "Password is required"], //hashed password
    },
    profileImageUrl: {
      type: String, //profile image URL
    },
    role: {
      type: String,
      enum: ["AUTHOR", "USER", "ADMIN"], //allowed roles only
      required: [true, "{Value} is an invalid role"],
    },
    isActive: {
      type: Boolean,
      default: true, //soft delete / account status
    },
  },
  {
    timestamps: true, //adds createdAt and updatedAt automatically
    strict: "throw", //throws error if extra fields are sent
    versionKey: false, //removes __v field from document
  }
);

//create model
export const UserTypeModel = model("user", userSchema);


