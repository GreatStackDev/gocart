'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loading from "../Loading"
import Button from "../ui/Button"
import SellerNavbar from "./StoreNavbar"
import SellerSidebar from "./StoreSidebar"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"


const StoreLayout = ({ children }) => {

    const { getToken } = useAuth()
    const router = useRouter()


    const [isSeller, setIsSeller] = useState(false)
    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState(null)

    const fetchIsSeller = async () => {
       try {
           const token = await getToken()
           const {data} = await axios.get('/api/store/is-seller', {
            headers: {
                Authorization: `Bearer ${token}`
            }
           })
           setIsSeller(data.isSeller)
           setStoreInfo(data.storeInfo) 
           setLoading(false)
       } catch (error) {
           console.log(error)
           
        
       } finally {
        setLoading(false)
       }
    }

    useEffect(() => {
        fetchIsSeller()
    }, [])

    return loading ? (
        <Loading />
    ) : isSeller ? (
        <div className="flex flex-col h-screen">
            <SellerNavbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <SellerSidebar storeInfo={storeInfo} />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-10 max-w-sm w-full">
                <h1 className="font-[family-name:var(--font-heading)] font-bold text-xl text-[#111827]">
                    Sellers only
                </h1>
                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                    This area is for approved sellers. Apply to open a store and you&apos;ll get access once approved.
                </p>
                <div className="flex flex-col gap-2 mt-6">
                    <Button variant="accent" size="md" onClick={() => router.push("/create-store")}>
                        Open a Store
                    </Button>
                    <Button variant="outline" size="md" onClick={() => router.push("/")}>
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default StoreLayout