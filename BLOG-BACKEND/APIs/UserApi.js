import exp from "express";
import { authenticate, register } from "../Services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js"
export const userRoute = exp.Router()

//Register user
userRoute.post(
    "/users",
    upload.single("profileImageURL"),
    async (req, res, next) => {
        let cloudinaryResult;

        try {
            //get user body
            let userObj = req.body;
            delete userObj.profileImageURL;

            //  Step 1: upload image to cloudinary from memoryStorage (if exists)
            if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            }

            // Step 2: call existing register()
            const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
            });

            res.status(201).json({
                message: "user created",
                payload: newUserObj,
            });

        } catch (err) {

            // Step 3: rollback 
            if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
            }

            next(err); // send to your error middleware
        }

    }
);

//Authenticate user


//Read all articles

userRoute.get('/articles', verifyToken("USER"), async (req, res) => {
    let articles = await ArticleModel.find({ isArticleActive: true }).populate("comments.user", "firstName email")
    res.status(200).json({ message: "Articles", payload: articles })
})

//Add comment to an article

userRoute.post('/articles/:articleId', verifyToken("USER"), async (req, res) => {
    const { user, articleId, comment } = req.body
    console.log(req.user)
    if (user != req.user.userId) {
        return res.status(403).json({ messsage: "Forbidden" })
    }
    let articleOfDB = await ArticleModel.findOne({ _id: articleId })
    if (!articleOfDB) {
        return res.status(404).json({ message: "Article not found" })
    }
    //update the article
    let updatedArticle = await ArticleModel.findByIdAndUpdate(articleId,
        { $push: { comments: { user, comment } } },
        { new: true, runValidators: true });

    await updatedArticle.populate("author", "firstName email");
    await updatedArticle.populate("comments.user", "firstName email");

    //send res(updated article)
    res.status(200).json({ message: "Article updated", payload: updatedArticle });
});

//Edit comment
userRoute.put('/articles/:articleId/comments/:commentId', verifyToken("USER"), async (req, res) => {
    const { articleId, commentId } = req.params;
    const { comment } = req.body;
    try {
        const article = await ArticleModel.findOneAndUpdate(
            { _id: articleId, "comments._id": commentId, "comments.user": req.user.userId },
            { $set: { "comments.$.comment": comment } },
            { new: true }
        ).populate("author", "firstName email").populate("comments.user", "firstName email");
        if (!article) return res.status(403).json({ message: "Not authorized or comment not found" });
        res.status(200).json({ message: "Comment updated", payload: article });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

//Delete comment
userRoute.delete('/articles/:articleId/comments/:commentId', verifyToken("USER"), async (req, res) => {
    const { articleId, commentId } = req.params;
    try {
        const article = await ArticleModel.findOneAndUpdate(
            { _id: articleId, "comments._id": commentId, "comments.user": req.user.userId },
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        ).populate("author", "firstName email").populate("comments.user", "firstName email");
        if (!article) return res.status(403).json({ message: "Not authorized or comment not found" });
        res.status(200).json({ message: "Comment deleted", payload: article });
    } catch (err) { res.status(500).json({ message: err.message }); }
});