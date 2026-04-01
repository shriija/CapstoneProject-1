import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router"
import { useAuth } from "../store/authStore"
import { useEffect } from "react";

function RootLayout() {

  const checkAuth=useAuth((state)=>state.checkAuth);
  const loading=useAuth((state)=>state.loading);

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  //wait until auth check completes
  if(loading) {
    return <p className="text-center mt-10">Loading...</p>
  }


  return (
    <div className="flex flex-col min-h-screen">
        <Header/>
        <div className="mx-20 flex-grow">
            <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default RootLayout