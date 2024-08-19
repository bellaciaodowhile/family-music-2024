import { Routes, Route, useNavigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { client } from "./supabase/client";
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { useEffect } from 'react'
import { Dashboard } from './pages/Dashboard';

function App() {

  const navigate = useNavigate();

  useEffect(() => {

    const { data } = client.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
      if (!session) {
        navigate('/login');
      } else {
        navigate('/dashboard');
      }
    });

    data.subscription.unsubscribe()

    console.log('AppJS')

  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={ <Home/> }></Route>
        <Route path="/login" element={ <Login/> }></Route>
        <Route path="/dashboard" element={ <Dashboard/> }></Route>
        <Route path="*" element={ <NotFound /> }></Route>
      </Routes>
    </>
  )
}

export default App
