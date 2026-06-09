import { Button, Input, Select, SelectItem } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { path } from 'framer-motion/client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as zod from "zod"
import { sendRegisterData } from '../Services/register'
import { Link, useNavigate } from 'react-router-dom'



const schema = zod.object({
    name: zod.string().nonempty('name is required').min(3, "name must be at least 3 characters").max(20, 'name must be at max 20 characters'),
    email: zod.string().nonempty('email is required').regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'invaild email'),
    password: zod.string().nonempty('password is required').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'invaild password'),
    rePassword: zod.string().nonempty('repassword is required'),
    dateOfBirth: zod.coerce.date('dateOfBirth is required').refine((val) => {
        const now = new Date().getFullYear();
        const birth = val.getFullYear();
        return now - birth >= 18

    }, 'your age is less than 18'),

    gender: zod.string().nonempty('gender is required'),

}).refine((data) => data.password === data.rePassword
    , {
        path: ['rePassword'],
        message: 'password and repassword not match'
    }
)




export default function RegisterPage() {

    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const { handleSubmit, register, formState } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            rePassword: "",
            dateOfBirth: "",
            gender: ""
        },
        resolver: zodResolver(schema)
    })


    async function signUp(data) {
        setLoading(true)
        const resp = await sendRegisterData(data)

        if (resp.error) {
            setApiError(resp.error)
        }
        else {
            navigate('/login')
        }


        setLoading(false)
    }



    return <div className='min-h-screen flex justify-center items-center'>
        <div className="min-w-md bg-white py-10 px-6 rounded-2xl shadow-2xl">
            <h2 className='text-center text-2xl mb-4'>RegisterPage </h2>
            <form onSubmit={handleSubmit(signUp)}
                className='flex flex-col gap-4'>
                <Input {...register('name')} isInvalid={Boolean(formState.errors.name?.message)} errorMessage={formState.errors.name?.message} variant='bordered' label="name" labelPlacement='outside' type="text" placeholder='Example' />
                <Input {...register('email')} isInvalid={Boolean(formState.errors.email?.message)} errorMessage={formState.errors.email?.message} variant='bordered' label="email" labelPlacement='outside' type="email" placeholder='User@Example' />
                <Input {...register('password')} isInvalid={Boolean(formState.errors.password?.message)} errorMessage={formState.errors.password?.message} variant='bordered' label="password" labelPlacement='outside' type="password" placeholder='Password' />
                <Input  {...register('rePassword')} isInvalid={Boolean(formState.errors.rePassword?.message)} errorMessage={formState.errors.rePassword?.message} variant='bordered' label="rePassword" labelPlacement='outside' type="password" placeholder='Password' />

                <div className="flex gap-3">
                    <Input {...register('dateOfBirth')} isInvalid={Boolean(formState.errors.dateOfBirth?.message)} errorMessage={formState.errors.dateOfBirth?.message} variant='bordered' label="dateOfBirth" labelPlacement='outside' type="date" placeholder='date' />

                    <Select {...register('gender')} isInvalid={Boolean(formState.errors.gender?.message)} errorMessage={formState.errors.gender?.message} className="max-w-xs" label="Select your gender" variant='bordered' labelPlacement='outside' placeholder='male'>

                        <SelectItem key={"male"}>male</SelectItem>
                        <SelectItem key={"female"}>female</SelectItem>

                    </Select>

                </div>
                {apiError && <p className='text-red-500 text-center'>{apiError}</p>}
                <Button isLoading={loading} type='submit' color='primary' >submit</Button>
                <p>if you haven't account,please <Link to={'/login'} className='text-blue-400'>signIn</Link></p>

            </form>
        </div>

    </div>
}
