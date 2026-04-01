import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../store/authStore";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  ghostBtn
} from "../styles/common";

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const article = location.state;
  const [articleData,setArticleData] = useState(article || null)
  const currentUser = useAuth(state => state.currentUser)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // prefill form
  useEffect(() => {
    if (!articleData) return;

    setValue("title", articleData.title);
    setValue("category", articleData.category);
    setValue("content", articleData.content);
  }, [articleData]);

  const updateArticle = async (data) => {
    try {

    await axios.put(
      `http://localhost:4000/author-api/articles`,
      { ...data, articleId: id, author: currentUser?.userId || currentUser?._id },
      { withCredentials:true }
    )

    toast.success("Article updated successfully")

    navigate("/authordashboard")

  } catch(err){
    toast.error(err.response?.data?.error || "Update failed")
  }
  };

  const getArticleById = async ()=>{
  try{
    let res = await axios.get(
      `http://localhost:4000/author-api/article/${id}`
    )
    setArticleData(res.data.payload)
  }catch(err){
    console.log(err)
  }
}

  return (
    <div className={`${formCard} mt-10`}>

      {/* Back Button */}
      <button onClick={() => navigate(-1)} className={ghostBtn + " flex items-center gap-1.5 mb-6 w-fit !px-0 hover:-translate-x-1 transition-transform"}>
        <span>←</span> Back
      </button>

      <h2 className={formTitle}>Edit Article</h2>

      <form onSubmit={handleSubmit(updateArticle)}>
        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>

          <input className={inputClass} {...register("title", { required: "Title required" })} />

          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>

          <select className={inputClass} {...register("category", { required: "Category required" })}>
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>

          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>

          <textarea rows="14" className={inputClass} {...register("content", { required: "Content required" })} />

          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        <button className={submitBtn}>Update Article</button>
      </form>
    </div>
  );
}

export default EditArticle;