import { createBrowserRouter, RouterProvider } from 'react-router'
import { useEffect } from 'react'
import { useAuth } from './store/authStore'
import RootLayout from './components/RootLayout'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import AddArticle from './components/AddArticle'
import UserDashboard from './components/UserDashboard'
import AuthorDashboard from './components/AuthorDashboard'
import AdminDashboard from './components/AdminDashboard'
import ArticleByID from "./components/ArticleByID";
import {Toaster} from 'react-hot-toast'
import EditArticle from './components/EditArticleForm'
import WriteArticle from "./components/WriteArticle"
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from './components/ErrorBoundary';
import Unauthorized from './components/Unauthorized'

function App() {
  const checkAuth = useAuth(state => state.checkAuth)
  
  useEffect(() => {
    checkAuth()
  }, [])

  const routerObj=createBrowserRouter([
    {
      path:"/",
      element:<RootLayout/>,
      errorElement:<ErrorBoundary/>,
      children:[
        {
          path:"",
          element:<Home/>,
        },
        {
          path:"register",
          element:<Register/>,
        },
        {
          path:"Login",
          element:<Login/>,
        },
        {
          path:"addarticle",
          element:
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <AddArticle/>
          </ProtectedRoute>,
        },
        {
          path:"userdashboard",
          element:
          <ProtectedRoute allowedRoles={["USER"]}>
          <UserDashboard/>
          </ProtectedRoute>,
        },
        {
          path:"authordashboard",
          element:
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
          <AuthorDashboard/>
          </ProtectedRoute>,
        },
        {
          path:"admindashboard",
          element:
          <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboard/>
          </ProtectedRoute>,
        },
        {
          path:"article/:articleId",
          element:<ArticleByID/>,
        },
        {
          path:"edit-article/:id",
          element:
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
          <EditArticle/>
          </ProtectedRoute>,
        },
        {
          path:"write-article",
          element:
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
          <WriteArticle/>
          </ProtectedRoute>,
        },
        {
          path:"/unauthorized",
          element:<Unauthorized/>
        }
      ]
    },

  ])
  return (<>
  <Toaster position='top-center' reverseOrder={false}/>
  <RouterProvider router={routerObj}/>
  </>)
}

export default App