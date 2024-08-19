import { Button } from '@nextui-org/react'
import { client } from "../supabase/client";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {

  const navigate = useNavigate();

  useEffect(()=> {
    client.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      !session ? navigate('/login') : navigate('/dashboard')
    })
  }, [])

  return (
    <>
        <h1 className="text-5xl">Dashboard</h1>
        <Button variant="solid" onClick={() => client.auth.signOut()}>
            Cerrar sesión
        </Button>
    </>
  )
}