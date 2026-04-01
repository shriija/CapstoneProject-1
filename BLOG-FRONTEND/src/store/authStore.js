import {create} from 'zustand'
import axios from 'axios'

export const useAuth = create((set)=>({
    currentUser : null,
    isAuthenticated : false,
    loading: true,
    error : null,
    login:async(userCredWithRole)=>{
        const {role,...userCredObj} = userCredWithRole
        try{
            //set loading state
            set({loading:true,error:null})
            //make api call
            let res = await axios.post("http://localhost:4000/common-api/login",userCredObj,{withCredentials:true})
            console.log("res is", res)
            //update state
            set({loading:false,isAuthenticated:true,currentUser:res.data.payload})
        }catch(err){
            console.log("error is", err)
            //set error
            set({
                loading: false,
                error : err.response?.data?.error || "error",
                isAuthenticated: false,
                currentUser : null
            })
        }

    },
    logout:async()=>{
        try{
            set({loading:true, error:null})
            let res = await axios.get("http://localhost:4000/common-api/logout",{withCredentials:true})
            set({loading:false,isAuthenticated:false,currentUser:null})
        }catch(err){
            console.log("error is", err)
            //set error
            set({
                loading: false,
                error : err.response?.data?.error || "error",
                isAuthenticated: false,
                currentUser : null
            })
        }
    },
    // restore login
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("http://localhost:4000/common-api/check-auth", { withCredentials: true });

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      // If user is not logged in → do nothing
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      // other errors
      console.error("Auth check failed:", err);
      set({ loading: false });
    }
  }
}))