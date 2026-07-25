import { Button, TextField, Label, Input, FieldError, Select, ListBox, ListBoxItem } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
    const { handleSubmit, register, formState, control } = useForm({
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
                <TextField isInvalid={Boolean(formState.errors.name?.message)}>
                    <Label>name</Label>
                    <Input {...register('name')} type="text" placeholder='Example' />
                    <FieldError>{formState.errors.name?.message}</FieldError>
                </TextField>

                <TextField isInvalid={Boolean(formState.errors.email?.message)}>
                    <Label>email</Label>
                    <Input {...register('email')} type="email" placeholder='User@Example' />
                    <FieldError>{formState.errors.email?.message}</FieldError>
                </TextField>

                <TextField isInvalid={Boolean(formState.errors.password?.message)}>
                    <Label>password</Label>
                    <Input {...register('password')} type="password" placeholder='Password' />
                    <FieldError>{formState.errors.password?.message}</FieldError>
                </TextField>

                <TextField isInvalid={Boolean(formState.errors.rePassword?.message)}>
                    <Label>rePassword</Label>
                    <Input {...register('rePassword')} type="password" placeholder='Password' />
                    <FieldError>{formState.errors.rePassword?.message}</FieldError>
                </TextField>

                <div className="flex gap-3 items-start">
                    <div className="flex-1">
                        <TextField isInvalid={Boolean(formState.errors.dateOfBirth?.message)}>
                            <Label>dateOfBirth</Label>
                            <Input {...register('dateOfBirth')} type="date" placeholder='date' />
                            <FieldError>{formState.errors.dateOfBirth?.message}</FieldError>
                        </TextField>
                    </div>

                    <div className="flex-1">
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Select
                                    placeholder="male"
                                    selectedKeys={value ? [value] : []}
                                    onSelectionChange={(keys) => {
                                        const selected = Array.from(keys)[0];
                                        onChange(selected);
                                    }}
                                    isInvalid={!!error}
                                    className="max-w-xs"
                                >
                                    <Label>Select your gender</Label>
                                    <Select.Trigger>
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <ListBox>
                                        <ListBoxItem id="male">male</ListBoxItem>
                                        <ListBoxItem id="female">female</ListBoxItem>
                                    </ListBox>
                                    <FieldError>{error?.message}</FieldError>
                                </Select>
                            )}
                        />
                    </div>

                </div>
                {apiError && <p className='text-red-500 text-center'>{apiError}</p>}
                <Button isPending={loading} type='submit' variant='primary' >submit</Button>
                <p>if you haven't account,please <Link to={'/login'} className='text-blue-400'>signIn</Link></p>

            </form>
        </div>

    </div>
}
