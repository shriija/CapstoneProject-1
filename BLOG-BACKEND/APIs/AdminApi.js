import exp from 'express'
import { ArticleModel } from '../models/ArticleModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import {UserTypeModel} from '../models/UserModel.js'
import {checkAuthor} from '../middlewares/checkAuthor.js'
export const adminRoute=exp.Router()

//Authenticate admin


//read all articles
adminRoute.get('/articles',verifyToken,async(req,res)=>{
    let articles=await ArticleModel.find()
    res.status(200).json({message:"Articles",payload:articles})
})

//block user
adminRoute.put('/block/:authorId',verifyToken,checkAuthor,async(req,res)=>{
    const {authorId}=req.params
    let blockedUser=await UserTypeModel.findByIdAndUpdate(authorId,{$set:{isActive:false}},{new:true})
    res.status(200).json({message:"Author blocked successfully",payload:blockedUser})
})


//unblock user
adminRoute.put('/unblock/:authorId',verifyToken,async(req,res)=>{
    const {authorId}=req.params
    let UnblockedUser=await UserTypeModel.findByIdAndUpdate(authorId,{$set:{isActive:true}},{new:true})
    res.status(200).json({message:"Author Unblocked successfully",payload:UnblockedUser})
})