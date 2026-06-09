import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './Layout/MainLayout'
import AuthenLayout from './Layout/AuthenLayout'
import FeedPage from './Pages/FeedPage'
import ProfilePage from './Pages/ProfilePage'
import SinglePostPage from './Pages/SinglePostPage'
import NotFoundPage from './Pages/NotFoundPage'
import RegisterPage from './Pages/RegisterPage'
import LoginPage from './Pages/LoginPage'
import { HeroUIProvider } from '@heroui/react'
import ProtectedRoute from './Components/ProtectedRoute'
import AuthRoute from './Components/AuthRoute'


const routers = createBrowserRouter([
  {
    path: '', element: <MainLayout />, children: [
      { index: true, element: <ProtectedRoute> <FeedPage /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: 'single-post/:id', element: <ProtectedRoute><SinglePostPage /></ProtectedRoute> },
      { path: '*', element: <NotFoundPage /> }

    ]
  },
  {
    path: '', element: <AuthenLayout />, children: [
      { path: 'register', element: <AuthRoute> <RegisterPage /> </AuthRoute> },
      { path: 'login', element: <AuthRoute> <LoginPage /> </AuthRoute> }
    ]
  },


])

function App() {
  const [count, setCount] = useState(0)

  return <>
    <HeroUIProvider>
      <RouterProvider router={routers}></RouterProvider>
    </HeroUIProvider>
  </>

}

export default App
