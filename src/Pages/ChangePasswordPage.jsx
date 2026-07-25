import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useNavigate } from 'react-router-dom'
import { changePasswordApi } from '../Services/ChangePasswordService'
import { KeyRound, Eye, EyeOff, ArrowLeft } from 'lucide-react'
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4 py-12">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-4">
                            <KeyRound size={28} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Change Password</h1>
                        <p className="text-slate-400 text-sm mt-1 text-center">
                            Keep your account secure with a strong password
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        {/* Current Password */}
                        <PasswordField
                            id="current-password"
                            label="Current Password"
                            placeholder="Enter current password"
                            show={showCurrent}
                            onToggle={() => setShowCurrent(p => !p)}
                            register={register('password')}
                            error={formState.errors.password?.message}
                        />

                        {/* New Password */}
                        <PasswordField
                            id="new-password"
                            label="New Password"
                            placeholder="Enter new password"
                            show={showNew}
                            onToggle={() => setShowNew(p => !p)}
                            register={register('newPassword')}
                            error={formState.errors.newPassword?.message}
                        />

                        {/* Confirm Password */}
                        <PasswordField
                            id="confirm-password"
                            label="Confirm New Password"
                            placeholder="Re-enter new password"
                            show={showConfirm}
                            onToggle={() => setShowConfirm(p => !p)}
                            register={register('confirmPassword')}
                            error={formState.errors.confirmPassword?.message}
                        />

                        {/* Password requirements hint */}
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.
                        </p>

                        {/* Submit */}
                        <button
                            id="submit-change-password"
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Updating…
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

function PasswordField({ id, label, placeholder, show, onToggle, register, error }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-slate-300">
                {label}
            </label>
            <div className={`relative flex items-center rounded-xl border transition-all bg-white/5 ${error ? 'border-red-500/60' : 'border-white/10 focus-within:border-indigo-500/60'}`}>
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    placeholder={placeholder}
                    {...register}
                    className="w-full bg-transparent text-white placeholder-slate-500 px-4 py-3 rounded-xl text-sm outline-none pr-10"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors"
                    tabIndex={-1}
                    aria-label={show ? 'Hide password' : 'Show password'}
                >
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
            </div>
            {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
        </div>
    )
}
