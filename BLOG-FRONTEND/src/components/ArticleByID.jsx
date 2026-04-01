import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router'
import { useAuth } from '../store/authStore'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { pageWrapper, pageTitleClass, mutedText, articleBody, headingClass, inputClass, primaryBtn, secondaryBtn, divider, ghostBtn } from '../styles/common'

function ArticleByID() {

  const { articleId } = useParams()
  const location = useLocation()
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null)
  
  // State for Add New Comment
  const [commentText, setCommentText] = useState("");

  // States for Edit Comment
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // States for Author Reply
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const getArticleById = async () => {
    try {
      let res = await axios.get(
        `http://localhost:4000/common-api/article/${articleId}`,
        { withCredentials: true }
      )
      setArticle(res.data.payload)
    } catch (err) {
      console.log(err)
    }
  }

  const onAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      let res = await axios.post(
        `http://localhost:4000/user-api/articles/${articleId}`,
        { user: user?.userId || user?._id, articleId, comment: commentText },
        { withCredentials: true }
      );
      setArticle(res.data.payload);
      setCommentText("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  const onEditComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      let res = await axios.put(
        `http://localhost:4000/user-api/articles/${articleId}/comments/${commentId}`,
        { comment: editCommentText },
        { withCredentials: true }
      );
      setArticle(res.data.payload);
      setEditCommentId(null);
      toast.success("Comment updated!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to update comment"); }
  };

  const onDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete your comment?")) return;
    try {
      let res = await axios.delete(
        `http://localhost:4000/user-api/articles/${articleId}/comments/${commentId}`,
        { withCredentials: true }
      );
      setArticle(res.data.payload);
      toast.success("Comment deleted!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to delete comment"); }
  };

  const onReplyToComment = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      let res = await axios.post(
        `http://localhost:4000/author-api/articles/${articleId}/comments/${commentId}/reply`,
        { reply: replyText },
        { withCredentials: true }
      );
      setArticle(res.data.payload);
      setReplyCommentId(null);
      setReplyText("");
      toast.success("Reply posted!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to post reply"); }
  };

  const toggleArticleStatus = async () => {
    const actionText = article.isArticleActive ? "delete" : "restore";
    if (!window.confirm(`Are you sure you want to ${actionText} this article?`)) return;
    try {
      await axios.patch(
        `http://localhost:4000/author-api/articles/${articleId}/status`,
        { isArticleActive: !article.isArticleActive },
        { withCredentials: true }
      );
      setArticle({...article, isArticleActive: !article.isArticleActive});
      toast.success(`Article ${article.isArticleActive ? "deleted" : "restored"} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const isAuthor = user?.role === "AUTHOR" && article?.author?._id === (user?.userId || user?._id);

  useEffect(() => {
    if (articleId) {
      getArticleById()
    }
  }, [articleId])

  if (!article) {
    return <p>Loading...</p>
  }

  return (
    <div className={pageWrapper}>

      {/* Back Button */}
      <button onClick={() => navigate(-1)} className={ghostBtn + " flex items-center gap-1.5 mb-6 w-fit !px-0 hover:-translate-x-1 transition-transform"}>
        <span>←</span> Back
      </button>

      <h1 className={pageTitleClass}>
        {article.title}
      </h1>

      {/* META & CONTENT */}
      <p className={mutedText + " mt-3 mb-6"}>
        By {article.author?.firstName || "Unknown"} • {""} {new Date(article.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} • {article.category}
      </p>

      {/* Author Controls */}
      {isAuthor && (
        <div className="mt-10 mb-10">
          <div className={divider + " my-6"}></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={headingClass}>Author Controls</h3>
            <span className={`px-3 py-1 text-[0.7rem] uppercase tracking-widest font-bold rounded-full border ${article.isArticleActive ? 'text-green-700 bg-green-100 border-green-300' : 'text-red-700 bg-red-100 border-red-300'}`}>
              Status: {article.isArticleActive ? "Active" : "Deleted"}
            </span>
          </div>
          <div className="flex gap-4">
            <button 
              className={secondaryBtn}
              onClick={() => navigate(`/edit-article/${article._id}`, { state: article })}
            >
              Edit Article
            </button>
            <button 
              className={secondaryBtn + (article.isArticleActive ? " !text-red-600 !border-red-200 hover:!bg-red-50" : " !text-green-600 !border-green-200 hover:!bg-green-50")}
              onClick={toggleArticleStatus}
            >
              {article.isArticleActive ? "Delete Article" : "Restore Article"}
            </button>
          </div>
          <div className={divider + " my-6"}></div>
        </div>
      )}

      <p className={articleBody}>
        {article.content}
      </p>

      {/* Comments Section */}
      <div className="mt-14">
        <h2 className={headingClass + " mb-6"}>Comments</h2>

        {/* Display Comments */}
        {article.comments && article.comments.length > 0 ? (
          article.comments.map((comment, index) => {
            const isMyComment = user?.role === "USER" && comment.user?._id === (user?.userId || user?._id);
            const isEditing = editCommentId === comment._id;
            const isReplying = replyCommentId === comment._id;

            return (
            <div key={index} className="bg-[#f5f5f7] rounded-2xl p-6 mb-5 border border-transparent hover:border-[#ebebf0] transition-all">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-[#1d1d1f]">
                  {comment.user?.firstName || "Unknown"}
                </p>
                <p className="text-xs text-[#a1a1a6]">
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  }) : "Just now"}
                </p>
              </div>

              {/* Edit Mode vs Display Mode */}
              {isEditing ? (
                 <div className="mt-2">
                   <textarea 
                     className={inputClass} 
                     rows="2" 
                     value={editCommentText} 
                     onChange={(e)=>setEditCommentText(e.target.value)}
                   ></textarea>
                   <div className="flex gap-3 mt-3">
                     <button className={primaryBtn + " !py-1.5 !px-5 text-xs"} onClick={() => onEditComment(comment._id)}>Save Changes</button>
                     <button className={ghostBtn + " !text-xs"} onClick={() => setEditCommentId(null)}>Cancel</button>
                   </div>
                 </div>
              ) : (
                 <>
                   <p className="text-[#1d1d1f] text-sm whitespace-pre-wrap">{comment.comment}</p>
                   
                   {/* Comment Actions */}
                   <div className="flex gap-4 mt-3">
                     {isMyComment && (
                       <>
                         <button className={ghostBtn + " !text-[0.75rem] font-semibold"} onClick={() => { setEditCommentId(comment._id); setEditCommentText(comment.comment); }}>Edit</button>
                         <button className={ghostBtn + " !text-[0.75rem] font-semibold !text-red-500 hover:!text-red-700"} onClick={() => onDeleteComment(comment._id)}>Delete</button>
                       </>
                     )}
                     {isAuthor && !comment.authorReply && (
                         <button className={ghostBtn + " !text-[0.75rem] font-semibold"} onClick={() => setReplyCommentId(comment._id)}>Reply</button>
                     )}
                   </div>
                 </>
              )}

              {/* Author Reply Box */}
              {comment.authorReply && (
                <div className="mt-5 p-4 bg-white border border-[#e8e8ed] rounded-xl ml-4 shadow-sm">
                   <p className="text-[0.7rem] font-bold text-[#0066cc] uppercase tracking-widest mb-1.5 flex items-center gap-2">
                     <span className="w-1 h-1 bg-[#0066cc] rounded-full"></span> Author Response
                   </p>
                   <p className="text-sm text-[#1d1d1f] whitespace-pre-wrap leading-relaxed">{comment.authorReply}</p>
                </div>
              )}

              {/* Dynamic Reply Input */}
              {isReplying && (
                 <div className="mt-5 ml-4 p-4 bg-white border border-[#e8e8ed] rounded-xl">
                   <h4 className="text-xs font-semibold text-[#1d1d1f] mb-2">Write Official Response</h4>
                   <textarea 
                     className={inputClass} 
                     rows="2" 
                     placeholder="Type your response to the user..." 
                     value={replyText} 
                     onChange={(e)=>setReplyText(e.target.value)}
                   ></textarea>
                   <div className="flex gap-3 mt-3">
                     <button className={primaryBtn + " !py-1.5 !px-5 text-xs"} onClick={() => onReplyToComment(comment._id)}>Post Reply</button>
                     <button className={ghostBtn + " text-xs"} onClick={() => { setReplyCommentId(null); setReplyText(""); }}>Cancel</button>
                   </div>
                 </div>
              )}

            </div>
          )})
        ) : (
           <p className={mutedText}>
             {user?.role === "USER" ? "No comments yet. Be the first to share your thoughts!" : "No comments yet."}
           </p>
        )}
      </div>

      {/* Add Comment Form for Users */}
      {user?.role === "USER" && (
        <div className="mt-10">
          <h3 className={headingClass + " mb-4"}>Add a Comment</h3>
          <form onSubmit={onAddComment}>
            <textarea 
              className={inputClass} 
              rows="3"
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button type="submit" className={primaryBtn + " w-auto"}>
                Post Comment
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}

export default ArticleByID