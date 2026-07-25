import { Button, TextField, Label, Input, FieldError } from '@heroui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useNavigate } from 'react-router-dom'
import { changePasswordApi } from '../Services/ChangePasswordService'
import { KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

const schema = zod.object({
    password: zod
        .string()
        .nonempty('Current password is required')
        .regex(passwordRegex, 'Password must be 8+ chars with uppercase, lowercase, number & special char'),
    newPassword: zod
        .string()
        .nonempty('New password is required')
        .regex(passwordRegex, 'Password must be 8+ chars with uppercase, lowercase, number & special char'),
    confirmPassword: zod.string().nonempty('Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

export default function ChangePasswordPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const { handleSubmit, register, formState, reset } = useForm({
        defaultValues: { password: '', newPassword: '', confirmPassword: '' },
        resolver: zodResolver(schema),
    })

    async function onSubmit(formData) {
        setLoading(true)
        try {
            await changePasswordApi({
                password: formData.password,
                newPassword: formData.newPassword,
            })
            toast.success('Password changed successfully! 🔒')
            reset()
            setTimeout(() => navigate(-1), 1500)
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                'Something went wrong. Please try again.'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen overflow-hidden flex justify-center items-center px-4">
            <div className="bg-white py-6 px-6 rounded-2xl shadow-2xl w-full max-w-md">

                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:text-black transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <KeyRound size={22} className="text-blue-500" />
                    <h2 className="text-2xl font-semibold">Change Password</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

                    {/* Current Password */}
                    <TextField isInvalid={Boolean(formState.errors.password?.message)}>
                        <Label>Current Password</Label>
                        <div className="relative flex items-center">
                            <Input
                                {...register('password')}
                                type={showCurrent ? 'text' : 'password'}
                                placeholder="Enter current password"
                                className="pr-10 w-full"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowCurrent(p => !p)}
                                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label={showCurrent ? 'Hide password' : 'Show password'}
                            >
                                {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        <FieldError>{formState.errors.password?.message}</FieldError>
                    </TextField>

                    {/* New Password */}
                    <TextField isInvalid={Boolean(formState.errors.newPassword?.message)}>
                        <Label>New Password</Label>
                        <div className="relative flex items-center">
                            <Input
                                {...register('newPassword')}
                                type={showNew ? 'text' : 'password'}
                                placeholder="Enter new password"
                                className="pr-10 w-full"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowNew(p => !p)}
                                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label={showNew ? 'Hide password' : 'Show password'}
                            >
                                {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        <FieldError>{formState.errors.newPassword?.message}</FieldError>
                    </TextField>

                    {/* Confirm Password */}
                    <TextField isInvalid={Boolean(formState.errors.confirmPassword?.message)}>
                        <Label>Confirm New Password</Label>
                        <div className="relative flex items-center">
                            <Input
                                {...register('confirmPassword')}
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Re-enter new password"
                                className="pr-10 w-full"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowConfirm(p => !p)}
                                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                            >
                                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        <FieldError>{formState.errors.confirmPassword?.message}</FieldError>
                    </TextField>

                    {/* Hint */}
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.
                    </p>

                    <Button id="submit-change-password" isPending={loading} type="submit" variant="primary">
                        Update Password
                    </Button>

                </form>
            </div>
        </div>
    )
}
