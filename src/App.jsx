import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './Layout/MainLayout'
import AuthenLayout from './Layout/AuthenLayout'
import FeedPage from './Pages/FeedPage'
import FeedContent from './Pages/FeedContent'
import ProfilePage from './Pages/ProfilePage'
import SinglePostPage from './Pages/SinglePostPage'
import NotFoundPage from './Pages/NotFoundPage'
import RegisterPage from './Pages/RegisterPage'
import LoginPage from './Pages/LoginPage'
import ProtectedRoute from './Components/ProtectedRoute'
import AuthRoute from './Components/AuthRoute'
import NotificationPage from './Pages/NotificationPage'
import SuggestionPage from './Pages/SuggestionPage'
import CommunityPage from './Pages/CommunityPage'
import BookmarkedPage from './Pages/BookmarkedPage'
import MyPosts from './Pages/MyPosts'
import UserProfilePage from './Pages/UserProfilePage'
import ChangePasswordPage from './Pages/ChangePasswordPage'


const routers = createBrowserRouter([
  {
    path: '', element: <MainLayout />, children: [
      // FeedPage layout — sidebar + main column + suggested friends
      {
        path: '', element: <ProtectedRoute><FeedPage /></ProtectedRoute>, children: [
          { index: true, element: <FeedContent /> },
          { path: 'community', element: <CommunityPage /> },
          { path: 'bookmarked', element: <BookmarkedPage /> },
          { path: 'mypost', element: <MyPosts /> },
        ]
      },

      // Separate full pages (navigate away from FeedPage)
      { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: 'notification', element: <ProtectedRoute><NotificationPage /></ProtectedRoute> },
      { path: 'suggestion', element: <ProtectedRoute><SuggestionPage /></ProtectedRoute> },
      { path: 'single-post/:id', element: <ProtectedRoute><SinglePostPage /></ProtectedRoute> },
      { path: 'user/:userId', element: <ProtectedRoute><UserProfilePage /></ProtectedRoute> },
      { path: 'change-password', element: <ProtectedRoute><ChangePasswordPage /></ProtectedRoute> },
      { path: '*', element: <NotFoundPage /> }
    ]
  },
  {
    path: '', element: <AuthenLayout />, children: [
      { path: 'register', element: <AuthRoute><RegisterPage /></AuthRoute> },
      { path: 'login', element: <AuthRoute><LoginPage /></AuthRoute> }
    ]
  },
])

function App() {
  return (
    <RouterProvider router={routers} />
  )
}

export default App
