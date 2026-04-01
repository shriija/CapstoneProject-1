import React, {useEffect,useState} from 'react'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import { cardClass, submitBtn, pageWrapper, headingClass, inputClass, divider, subHeadingClass } from '../styles/common'
import {toast} from 'react-hot-toast'
import axios from 'axios'

function UserDashboard() {
  
  //get logout func from auth store
  const logout = useAuth(state => state.logout)
  const currentUser = useAuth(state => state.currentUser)
  const navigate = useNavigate()
  const [articles,setArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  if(!currentUser){
    return <p className="text-center mt-10">Restoring session...</p>
  }

  //perform logout and make it to navigate to login
  const onLogout = async() =>{
    //logout
    await logout()
    toast.success("Logged out successfully")
    //navigate
    navigate("/Login")
  }

  //read articles of all authors
  const getArticles = async () =>{
    try{
      let res = await axios.get("http://localhost:4000/user-api/articles", {withCredentials:true})
      setArticles(res.data.payload)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    if(currentUser){
      getArticles()
    }
  },[currentUser])

  // Filter and Group Logic
  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? a.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const groupedArticles = filteredArticles.reduce((acc, article) => {
    if (!acc[article.category]) acc[article.category] = [];
    acc[article.category].push(article);
    return acc;
  }, {});

  return (
    <div className={pageWrapper}>
      <div className="flex justify-between mb-6">
        <h2 className={headingClass}>UserDashboard</h2>
      </div>

      {currentUser && (
        <div className="flex items-center gap-4 mb-8">
          <img 
            src={currentUser.profileImageUrl || 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=👤'} 
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border border-[#e8e8ed]"
          />
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
              Welcome back, {currentUser.firstName}
            </h2>
            <p className="text-[#6e6e73] text-sm mt-0.5">
              Explore the latest articles from authors
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      {currentUser && (
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#f5f5f7] p-5 rounded-2xl border border-[#e8e8ed]">
          <input 
            type="text" 
            placeholder="Search articles by title..." 
            className={inputClass + " flex-1"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className={inputClass + " md:w-64"}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>
        </div>
      )}

      {/* Grouped Articles */}
      <div className="mb-10">
        {Object.keys(groupedArticles).length === 0 ? (
          <p className="text-center text-[#a1a1a6] mt-10">No articles found matching your criteria.</p>
        ) : (
          Object.keys(groupedArticles).map(category => (
            <div key={category} className="mb-12">
              <h3 className={subHeadingClass + " mb-4 uppercase tracking-widest text-[#0066cc] text-sm"}>
                {category.replace("-", " ")}
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {groupedArticles[category].map((article)=>(
                  <div key={article._id} className={cardClass} onClick={()=>navigate(`/article/${article._id}`,{state:article})}>
                  <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm">{article.content?.substring(0,12)}...</p>
                  </div>
                ))}
              </div>
              <div className={divider + " mt-8"}></div>
            </div>
          ))
        )}
      </div>

      <button className={submitBtn} onClick={onLogout}>Logout</button>
    </div>
  )
}

export default UserDashboard