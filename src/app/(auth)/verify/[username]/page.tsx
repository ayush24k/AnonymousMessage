'use client'
import { GetVerifySchema, verifySchema } from "@/ZodValidation/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { tree } from "next/dist/build/templates/app-page";
import { useParams, useRouter } from "next/navigation"
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function verifyCodePage () {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter();
    const param = useParams<{username: string}>()
    const username = param.username

    const form = useForm<GetVerifySchema>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: GetVerifySchema) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post(`api/verify-code`, {data, username})
        } catch (error) {
            
        }
    }
    return (
        <div>
            veriy code {username}
        </div>
    )
}