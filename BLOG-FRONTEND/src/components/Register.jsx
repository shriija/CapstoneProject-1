import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  errorClass,
  loadingClass,
  submitBtn,
  formCard,
  formTitle,
  inputClass,
  labelClass,
  formGroup,
  fileInputClass
} from "../styles/common";
import { useState } from "react";
import { useEffect } from "react";

function Register() {

  const { register, handleSubmit, formState:{errors} } = useForm();
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [preview,setPreview]=useState()

  useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
        }, [preview]);

  const onUserRegister = async (newUser) => {

    setLoading(true);
    setError(null)
       
    // Create form data object
        const formData = new FormData();
        //get user object
        let { role, profileImageURL, ...userObj } = newUser;
        console.log("role",role)
        console.log("profileImageURL", profileImageURL)
        //add all fields except profilePic to FormData object
        Object.keys(userObj).forEach((key) => {
        formData.append(key, userObj[key]);
        });
        
        // add profilePic to Formdata object only if it exists
        if (profileImageURL && profileImageURL.length > 0) {
            formData.append("profileImageURL", profileImageURL[0]);
        }

    try {

      if(role === "user"){
        let resObj = await axios.post(
          "http://localhost:4000/user-api/users",
          formData
        );

        if(resObj.status === 201){
          navigate("/Login");
        }
      }

      if(role === "author"){
        let resObj = await axios.post(
          "http://localhost:4000/author-api/users",
          formData
        );

        if(resObj.status === 201){
          navigate("/Login");
        }
      }

    } catch(err){
      setError(err.response?.data?.error || "Registration failed");
    } finally{
      setLoading(false);
    }
  }

  if(loading){
    return <p className={loadingClass}>Loading...</p>
  }

  return (
    <div className="mt-10 mb-10">
      <form onSubmit={handleSubmit(onUserRegister)} className={formCard}>

        {error && <p className={errorClass}>{error}</p>}

        <h2 className={formTitle}>Register</h2>

        <div className={formGroup}>
          <label className={labelClass}>Select Role</label>

          <input type="radio" value="user" {...register("role",{required:true})}/> User
          <input type="radio" className="ml-3" value="author" {...register("role",{required:true})}/> Author

          {errors.role && <p className="text-red-500">Role required</p>}
        </div>

        <div className={formGroup}>
          <input type="text" placeholder="First name" {...register("firstName",{required:true})} className={inputClass}/>
        </div>

        <div className={formGroup}>
          <input type="text" placeholder="Last name" {...register("lastName",{required:true})} className={inputClass}/>
        </div>

        <div className={formGroup}>
          <input type="email" placeholder="Email" {...register("email",{required:true})} className={inputClass}/>
        </div>

        <div className={formGroup}>
          <input type="password" placeholder="Password" {...register("password",{required:true,minLength:6})} className={inputClass}/>
        </div>

        <input
        type="file"
        accept="image/png, image/jpeg"
        className={fileInputClass}
        {...register("profileImageURL")}
        onChange={(e) => {

            //get image file
            const file = e.target.files[0];
            // validation for image format
            if (file) {
                if (!["image/jpeg", "image/png"].includes(file.type)) {
                setError("Only JPG or PNG allowed");
                return;
                }
                //validation for file size
                if (file.size > 2 * 1024 * 1024) {
                setError("File size must be less than 2MB");
                return;
                }
                //Converts file → temporary browser URL(create preview URL)
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
                setError(null);
            }

        }}  /> 
        
        {preview && (
                <div className="mt-3 flex justify-center">
                <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full border"
                />
                </div>
            )}

        <button className={submitBtn}>Register</button>

      </form>
    </div>   
  )
}

export default Register