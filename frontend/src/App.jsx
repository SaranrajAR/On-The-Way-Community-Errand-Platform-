
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import { Navigate, Route, Routes } from 'react-router'
import { useAuthStore } from './store/useAuthStore'
import 'leaflet/dist/leaflet.css';
import RideSharePage from './pages/RideSharePage'
import Notification from './pages/Notification'
import RideLocationPage from './components/RideLocationPage'
import { useEffect } from 'react'
import PageLoader from './components/PageLoader'
import { Toaster } from 'react-hot-toast'
import Profile from './pages/Profile'
import "leaflet/dist/leaflet.css";
import RideConfirmedPage from './pages/RideConfirmedPage'
const App = () => {
 
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();

    // Optional but clean: 
    // This ensures that if the app unmounts, the socket doesn't hang around
    return () => {
      const { disconnectSocket } = useAuthStore.getState();
      disconnectSocket();
    };
  }, [checkAuth]);


  if (isCheckingAuth) {
    return <PageLoader />
  }
  return (

    <div >

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={authUser ? <Navigate to="/" /> : <SignUpPage />} />
        <Route path='/login' element={authUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path='/ride' element={authUser ? <RideSharePage /> : <Navigate to="/login" />} />
        <Route path='/notification' element={authUser ? <Notification /> : <Navigate to="/login" />} />
        <Route path='/ride-confirmed' element={authUser ? <RideConfirmedPage /> : <Navigate to="/login" />} />
        <Route path="/ride/:id" element={<RideLocationPage />} />


      </Routes>

      <Toaster />
    </div>


  )
}

export default App