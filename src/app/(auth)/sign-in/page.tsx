'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/ZodValidation/signUpSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"



export default function SignInPage () {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsrnameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedUsername = useDebounceValue(username, 300);
    const {toast} = useToast();
    const router = useRouter();


    // zod validation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true)
                setUsrnameMessage("")

                try{
                    const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
                    setUsrnameMessage(response.data.message);
                } catch (err) {
                    const axiosError = err as AxiosError<ApiResponse>
                    setUsrnameMessage(axiosError.response?.data.message || "Error checking username")
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        } 
    }, [debouncedUsername])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast({
                title: 'success',
                description: response.data.message 
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            console.error("Error in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message;

            toast({
                title: "Signup Failed",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            sign-in Page
        </div>
    )
}