'use client'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { GetVerifySchema, verifySchema } from "@/ZodValidation/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function verifyCodePage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter();
    const param = useParams<{ username: string }>()
    const username = param.username

    const { toast } = useToast()

    const form = useForm<GetVerifySchema>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = async (data: GetVerifySchema) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: username,
                verifyCode: data.code
            })

            toast({
                title: "success",
                description: response.data.message
            })
            router.replace('/sign-in')
            setIsSubmitting(false)
        } catch (error) {
            console.error("Error verifying the user", error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errMessage = axiosError.response?.data.message

            toast({
                title: "Verification Failed",
                description: errMessage,
                variant: "destructive"
            })
            setIsSubmitting(false)
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Account</h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="6-digit code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" /> please wait
                                    </>
                                ) : 'Verify'
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}