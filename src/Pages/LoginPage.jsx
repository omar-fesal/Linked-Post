import { Button, Input } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as zod from "zod"
import { signInData } from '../Services/login'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'





const schema = zod.object({
    email: zod.string().nonempty('email is required').regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'invaild email'),
    password: zod.string().nonempty('password is required').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'invaild password'),
})

export default function LoginPage() {
    const { isLogged, setIsLogged } = useContext(AuthContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const { handleSubmit, register, formState } = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: zodResolver(schema)
    })


    async function signIn(data) {
        setLoading(true)
        setApiError(null) // Clear previous errors
        const resp = await signInData(data)
        // console.log(resp); //can be data or error that come from function signInData from login.jsx
        if (resp.error) {
            setApiError(resp.error)
            setLoading(false)
        }
        else {
            localStorage.setItem('token', resp.token)
            setIsLogged(true)
            // The AuthRoute component will handle navigation automatically
        }
    }
    return <div className='min-h-screen flex justify-center items-center'>
        <div className="min-w-md bg-white py-10 px-6 rounded-2xl shadow-2xl">
            <h2 className='text-center text-2xl mb-4'>loginPage</h2>
            <form onSubmit={handleSubmit(signIn)} className='flex flex-col gap-4' >
                <Input {...register('email')} isInvalid={Boolean(formState.errors.email?.message)}
                    errorMessage={formState.errors.email?.message}
                    variant='bordered'
                    label="email"
                    labelPlacement='outside'
                    type="email" placeholder='User@Example' />


                <Input  {...register('password')} isInvalid={Boolean(formState.errors.password?.message)}
                    errorMessage={formState.errors.password?.message}
                    variant='bordered'
                    label="password"
                    labelPlacement='outside'
                    type="password" placeholder='password' />

                {apiError && <p className='text-red-500 text-center'>{apiError}</p>}
                <Button isLoading={loading} type='submit' color='primary' >submit</Button>
                <p>if you haven't account,please <Link to={'/register'} className='text-blue-400'>signUp</Link></p>
            </form>

        </div>

    </div>
}
