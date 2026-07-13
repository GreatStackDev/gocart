'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import Modal from "@/components/ui/Modal"

export default function AdminApprove() {
    const { user } = useUser()
    const { getToken } = useAuth()
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [selectedStoreId, setSelectedStoreId] = useState(null)
    const [reviewNote, setReviewNote] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const fetchStores = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get("/api/admin/approve-store", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setStores(data.stores)
            setLoading(false)
        } catch (error) {
            console.log(error)
            toast.error(
                error.response?.data?.error || "Failed to load stores",
            );
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async ({ storeId, status, note = "" }) => {
        try {
            const token = await getToken()
            const { data } = await axios.post("/api/admin/approve-store", {
                storeId,
                status,
                reviewNote: note
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data.message)

            await fetchStores()
            return data.message || `Store ${status} successfully`
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.error || "Action failed")
            throw error; // Rethrow to let toast.promise catch it if used
        }
    }

    const onRejectClick = (storeId) => {
        setSelectedStoreId(storeId)
        setReviewNote("")
        setRejectModalOpen(true)
    }

    const submitRejection = async () => {
        if (!reviewNote.trim()) {
            return toast.error("Please provide a reason for rejection")
        }
        setSubmitting(true)
        await handleApprove({ storeId: selectedStoreId, status: 'rejected', note: reviewNote })
        setSubmitting(false)
        setRejectModalOpen(false)
    }

    useEffect(() => {
        user && fetchStores()
    }, [user])

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                Verification Queue
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">Review and approve new store applications and ID documents.</p>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-8">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border rounded-xl shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex gap-3 pt-2 flex-wrap">
                                <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'approved' }), { loading: "Approving...", success: (msg) => msg, error: (err) => err.message })} className="px-6 py-2.5 bg-[#059669] text-white rounded-[8px] font-medium hover:bg-[#047857] transition-colors text-sm" >
                                    Approve
                                </button>
                                <button onClick={() => onRejectClick(store.id)} className="px-6 py-2.5 bg-[#EF4444] text-white rounded-[8px] font-medium hover:bg-[#DC2626] transition-colors text-sm" >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}

                </div>) : (
                <div className="flex flex-col items-center justify-center h-80 bg-white border border-gray-100 rounded-xl mt-8">
                    <div className="w-16 h-16 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#1E1B4B] mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <h1 className="text-xl text-[#1E1B4B] font-semibold">Queue Empty</h1>
                    <p className="text-[#6B7280] mt-2">There are no pending store applications to review.</p>
                </div>
            )}

            {/* Reject Modal */}
            <Modal
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                title="Reject Store Application"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Please provide a reason for rejecting this application. The seller will see this note on their dashboard and can update their application accordingly.
                    </p>
                    <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder="e.g., ID document is blurry, or name doesn't match..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                        rows="4"
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setRejectModalOpen(false)}
                            className="px-4 py-2 border border-gray-200 rounded-[8px] text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={submitRejection}
                            disabled={submitting}
                            className="px-4 py-2 bg-[#EF4444] text-white rounded-[8px] hover:bg-[#DC2626] transition-colors disabled:opacity-50"
                        >
                            {submitting ? "Rejecting..." : "Confirm Rejection"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    ) : <Loading />
}