'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from "next/link"
import { useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"



export default function SignInPage () {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsrnameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedUsername = useDebounceValue(username, 300);
    const {toast} = useToast();
    const router = useRouter();

    
    return (
        <div>
            sign-in Page
        </div>
    )
}