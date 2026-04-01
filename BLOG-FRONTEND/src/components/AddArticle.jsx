import { useForm } from "react-hook-form";
import { pageWrapper, formCard, formTitle, inputClass, submitBtn } from "../styles/common"

function AddArticle(){

  const {register,handleSubmit,formState:{errors}}=useForm()

  const onSubmit=(data)=>{
    console.log(data)
  }

  return(
    <div className={pageWrapper}>

      <form onSubmit={handleSubmit(onSubmit)} className={formCard}>

        <h2 className={formTitle}>Add Article</h2>

        <input type="text" placeholder="Title" {...register("title",{required:true})} className={inputClass}/>

        <select {...register("category")} className="border w-full p-2">
          <option value="">Select Category</option>
          <option value="tech">Tech</option>
          <option value="education">Education</option>
          <option value="health">Health</option>
        </select>

        <textarea placeholder="Content" {...register("content",{required:true})} className="border w-full p-2"  />

        <button className={submitBtn}> Publish Article  </button>

      </form>

    </div>
  )
}

export default AddArticle