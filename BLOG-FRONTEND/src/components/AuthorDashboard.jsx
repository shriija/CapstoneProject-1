import React, {useEffect,useState} from 'react'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import { cardClass, submitBtn, pageWrapper, headingClass, inputClass, subHeadingClass, divider, secondaryBtn, ghostBtn } from '../styles/common'
import {toast} from 'react-hot-toast'
import axios from 'axios'

function AuthorDashboard() {
  
  const logout = useAuth(state => state.logout)
  const currentUser = useAuth(state => state.currentUser)
  const navigate = useNavigate()
  const [articles,setArticles] = useState([])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  if(!currentUser){
    return <p className="text-center mt-10">Restoring session...</p>
  }

  const onLogout = async() =>{
    await logout()
    toast.success("Logged out successfully")
    navigate("/Login")
  }

  const getArticles = async () =>{
    try{
      let res = await axios.get(`http://localhost:4000/author-api/articles/${currentUser?.userId || currentUser?._id}`, {withCredentials:true})
      setArticles(res.data.payload)
    }catch(err){
      console.log(err)
    }
  }

  const toggleArticleStatus = async (e, articleId, currentStatus) => {
    e.stopPropagation();
    const actionText = currentStatus ? "delete" : "restore";
    if (!window.confirm(`Are you sure you want to ${actionText} this article?`)) return;
    try {
      await axios.patch(
        `http://localhost:4000/author-api/articles/${articleId}/status`,
        { isArticleActive: !currentStatus },
        { withCredentials: true }
      );
      setArticles(articles.map((article) => article._id === articleId ? { ...article, isArticleActive: !currentStatus } : article));
      toast.success(`Article ${currentStatus ? "deleted" : "restored"} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

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
      <div className="flex items-center justify-between mb-8">
        <h2 className={headingClass}>AuthorDashboard</h2>
        <button className={submitBtn + " !w-auto !py-2 !px-6 text-sm"} onClick={() => navigate('/write-article')}>Write New Article</button>
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
              Manage your published articles and drafts
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
          <p className="text-center text-[#a1a1a6] mt-10">You do not have any articles matching these criteria.</p>
        ) : (
          Object.keys(groupedArticles).map(category => (
            <div key={category} className="mb-12">
              <h3 className={subHeadingClass + " mb-4 uppercase tracking-widest text-[#0066cc] text-sm"}>
                {category.replace("-", " ")}
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {groupedArticles[category].map((article)=>(
                  <div key={article._id} className={cardClass + " flex flex-col cursor-pointer hover:shadow-md transition-shadow"} onClick={()=>navigate(`/article/${article._id}`,{state:article})}>
                    
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold line-clamp-1">{article.title}</h3>
                      <span className={`px-2 py-0.5 text-[0.6rem] uppercase tracking-widest font-bold rounded-full border shrink-0 ${article.isArticleActive ? 'text-green-700 bg-green-100 border-green-300' : 'text-red-700 bg-red-100 border-red-300'}`}>
                        {article.isArticleActive ? "Active" : "Deleted"}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.content}</p>
                    
                    <div className="flex justify-between mt-auto pt-4 border-t border-[#e8e8ed] gap-2">
                        <button className={ghostBtn + " !text-xs !py-1 !px-2 font-semibold"} onClick={(e)=> {
                          e.stopPropagation(); 
                          navigate(`/edit-article/${article._id}`, {state: article});
                        }}>Edit</button>

                        <button 
                          className={ghostBtn + " !text-xs !py-1 !px-2 font-semibold " + (article.isArticleActive ? "!text-red-500 hover:!text-red-700" : "!text-green-600 hover:!text-green-700")} 
                          onClick={(e) => toggleArticleStatus(e, article._id, article.isArticleActive)}
                        >
                          {article.isArticleActive ? "Delete" : "Restore"}
                        </button>
                    </div>

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

export default AuthorDashboard