import { Schema, model } from "mongoose";

//user comment schema (embedded document)
//used for storing comments inside an article
const userCommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, //stores reference ID
    ref: "user", //refers to user collection
  },
  comment: {
    type: String, //comment text
  },
});

//article schema
const articleSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId, //author ID
      ref: "user", //reference to user collection
      required: [true, "Author ID required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    //array of embedded comment documents
    comments: [userCommentSchema],
    isArticleActive: {
      type: Boolean,
      default: true, //soft delete / visibility control
    },
  },
  {
    timestamps: true, //automatically adds createdAt & updatedAt
    strict: "throw", //throws error if extra fields are passed
    versionKey: false, //removes __v field
  }
);

//create article model
export const ArticleModel = model("article", articleSchema);
