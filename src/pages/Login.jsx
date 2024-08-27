import { Button } from "@nextui-org/react";
import { BorderContainer } from '../components/BorderContainer'
import { Input } from "@nextui-org/react";
import { useForm } from "../hooks/useForm";
import { client } from "../supabase/client";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { EyeFilledIcon } from "../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon";


export const Login = () => {

    const navigate = useNavigate();
    
    useEffect(()=> {
        client.auth.onAuthStateChange((event, session) => {
            !session ? navigate('/login') : navigate('/dashboard')
        })
    }, [navigate])

    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const toggleVisibility = () => setIsVisible(!isVisible);

    const { formState, onInputChange, setFormState } = useForm({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await client.auth.signInWithPassword({
                email: formState.user,
                password: formState.password
            })
            setIsLoading(true)
            if (!data.user)  {
                alert('Verifique, ha ingresado algún dato incorrecto.')
                setIsLoading(false)
            } 
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <div className="flex justify-center items-center h-screen">

                <div className="form w-96 text-left shadow-xl p-10">
                    <h1 className="text-xl font-bold">Administración</h1>
                    <h2 className="text-xs">Música en Familia 2024</h2>
                    <h2 className="text-md mt-5">Inicio de sesión</h2>
                    <form onSubmit={ handleSubmit } className="mt-5">
                        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                            <Input 
                            type="text" 
                            variant="underlined"
                            label="Usuario"
                            onChange={onInputChange} 
                            name="user" 
                            color="primary" />
                        </div>

                        <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-5">
                            <Input
                            label="Contraseña"
                            variant="underlined"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="max-w-xs"
                            onChange={onInputChange} 
                            name="password" 
                            color="primary" 
                            />
                        </div>

                        <Button type="submit" radius="sm" className="w-full mt-10 text-white font-bold bg-blue-500" isLoading={isLoading}>
                            { isLoading ? 'Entrando' : 'Entrar' }
                        </Button>  
                        
                    </form>
                    <Button radius="sm" className="w-full mt-5 text-blue-500 font-bold bg-white">
                        <NavLink>
                            Inicio
                        </NavLink> 
                    </Button>
                </div>

            </div>


        </>
    )
}
