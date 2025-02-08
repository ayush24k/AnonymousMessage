'use client'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import dbConnect from "@/lib/dbConnect"
import { ApiResponse } from "@/types/ApiResponse"
import { GetSignInSchema, signInSchema } from "@/ZodValidation/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"


export default function SignInPage() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<GetSignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        }
    })

    // todo have to create sign in route
    const onSubmit = async (data: GetSignInSchema) => {
        setIsSubmitting(true)
        try {
            const response = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password
            })

            if (response?.error) {
                toast({
                    title: "Sign In Failed",
                    description: "Incorrect user or password",
                    variant: "destructive"
                })
            }

            setIsSubmitting(false)

            if (response?.url) {
                router.replace('/dashboard')
            }
        } catch (error) {
            console.error("Error sigin you in", error)

            toast({
                title: "Sign In Failed",
                description: "Incorrect user or password",
                variant: "destructive"
            })
            setIsSubmitting(false)
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
                    <p className="mb-4">Sign Up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username/Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username/email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                    </>
                                ) : ('Sign in')
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        don't have an account{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}