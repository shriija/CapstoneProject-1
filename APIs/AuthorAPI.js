import exp from "express";
import { authenticate, register } from "../services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const authorRoute = exp.Router();

//register author (public route)
authorRoute.post("/users", async (req, res) => {
  //get user object from request body
  let userObj = req.body;

  //call register service
  //role is enforced by backend, not client
  const newUserObj = await register({ ...userObj, role: "AUTHOR" });

  //send response
  res.status(201).json({
    message: "author created",
    payload: newUserObj,
  });
});


//create article (protected route)
authorRoute.post(
  "/articles",
  verifyToken,
  checkAuthor,
  async (req, res) => {
    //get article data from request
    let article = req.body;

    //create article document
    let newArticleDoc = new ArticleModel(article);

    //save article to DB
    let createdArticleDoc = await newArticleDoc.save();

    //send response
    res.status(201).json({
      message: "article created",
      payload: createdArticleDoc,
    });
  }
);

//read articles of author (protected route)
authorRoute.get(
  "/articles/:authorId",
  verifyToken,
  checkAuthor,
  async (req, res) => {
    //get author id from params
    let aid = req.params.authorId;

    //read active articles of this author
    let articles = await ArticleModel.find({
      author: aid,
      isArticleActive: true,
    }).populate("author", "firstName email"); //populate author details

    //send response
    res.status(200).json({
      message: "articles",
      payload: articles,
    });
  }
);

//edit article (protected route)
authorRoute.put(
  "/articles",
  verifyToken,
  checkAuthor,
  async (req, res) => {
    //get updated article data from request
    let { articleId, title, category, content, author } = req.body;

    //check if article exists for this author
    let articleOfDB = await ArticleModel.findOne({
      _id: articleId,
      author: author,
    });

    if (!articleOfDB) {
      return res.status(401).json({ message: "Article not found" });
    }

    //update article
    let updatedArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      {
        $set: { title, category, content },
      },
      { new: true }
    );

    //send updated article
    res.status(200).json({
      message: "article updated",
      payload: updatedArticle,
    });
  }
);

//delete (soft delete) article (protected route)
authorRoute.put('/articles/:articleId/delete', verifyToken, checkAuthor, async (req, res) => {
   try {
     let { articleId } = req.params 
     let deletedArticle = await ArticleModel.findOneAndUpdate( { _id: articleId, author: req.authorId },
       { $set: { isArticleActive: false } }, { new: true } ) 
       if (!deletedArticle) {
         return res.status(404).json({ message: "article NOT found or not authorized" }) } 
         res.status(200).json({ message: "article deleted (soft delete)", payload: deletedArticle }) } 
         catch (error) { res.status(500).json({ message: error.message }) }})
//http://localhost:4000/user-api/users
//http://localhost:4000/author-api/users

//app.use(checkAuthor) → global usage (not used here)
