import exp from 'express'
import {register, authenticate} from '../services/authService.js'
import { UserTypeModel } from '../models/UserModel.js'
//import { use } from 'react'
export const userRoute = exp.Router()
import { verifyToken } from "../middlewares/verifyToken.js";

//register user
userRoute.post('/users',async(req,res)=>{
    //get user obj from req
    let userObj = req.body
    //call register
    const newUserObj = await register({...userObj,role:"USER"})
    //role should be assigned by the server and not the client
    //res
    res.status(201).json({message:'User Created',payload:newUserObj})
})

//read all articles(protected route)
//Read all articles

userRoute.get('/articles',verifyToken,async(req,res)=>{
    let articles=await ArticleModel.find()
    res.status(200).json({message:"Articles",payload:articles})
})

//Add comment to an article

userRoute.post('/articles/:articleId',async(req,res)=>{
    const { articleId } = req.params
    let {comment}=req.body
    let articleOfDB=await ArticleModel.findOne({_id:articleId})
    if(!articleOfDB){
        return res.status(404).json({message:"Article not found"})
    }
    //update the article
    let updatedArticle=await ArticleModel.findByIdAndUpdate(articleId,
        {$push:{ comments:{comment: comment }}},
        { new:true});
        //send res(updated article)
     res.status(200).json({message:"Article updated",payload:updatedArticle})
})