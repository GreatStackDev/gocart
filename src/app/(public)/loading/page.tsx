'use client'

import Loading from "@/src/components/Loading"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoadingPage() {
    const router = useRouter()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const url = params.get('nextUrl')

        if (url) {
            setTimeout(() => {
                router.push(url)
            }, 8000)
        }
    }, [router])

    return <Loading />
}
