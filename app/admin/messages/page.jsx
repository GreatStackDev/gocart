'use client'

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import { SearchIcon, MessageSquareIcon } from "lucide-react"
import ChatWidget from "@/components/ChatWidget"

export default function AdminMessagesPage() {
    const { getToken } = useAuth()
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [search, setSearch] = useState("")

    const fetchConversations = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get("/api/admin/conversations", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setConversations(data.conversations || [])
        } catch (error) {
            console.error("Failed to fetch conversations:", error)
            toast.error("Failed to load platform messages")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchConversations()
        const interval = setInterval(fetchConversations, 30000)
        return () => clearInterval(interval)
    }, [])

    const filteredConversations = conversations.filter(c => 
        c.buyer?.name?.toLowerCase().includes(search.toLowerCase()) || 
        c.store?.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.order?.id?.includes(search)
    )

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col -mx-5 lg:-mx-12 -mt-5 lg:-mt-12">
            {/* Header */}
            <div className="px-5 lg:px-12 py-5 border-b border-[#E5E7EB] bg-white shrink-0">
                <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                    Platform Messages
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">Monitor and moderate all in-app communications between buyers and sellers.</p>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Conversations List */}
                <div className={`w-full md:w-1/3 bg-white border-r border-[#E5E7EB] flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-[#E5E7EB]">
                        <div className="relative">
                            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                            <input 
                                type="text"
                                placeholder="Search by name, store, or order ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#1E1B4B]"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-[#9CA3AF] text-sm animate-pulse">Loading conversations...</div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="p-8 text-center text-[#9CA3AF] text-sm">
                                No conversations found.
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <button 
                                    key={conv.id}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`w-full text-left p-4 border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors ${selectedConversation?.id === conv.id ? 'bg-[#EEF2FF] hover:bg-[#EEF2FF]' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-full bg-[#1E1B4B] text-white flex items-center justify-center font-bold">
                                            {conv.buyer?.name?.[0] || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className="font-semibold text-[#111827] truncate text-sm">
                                                    {conv.buyer?.name} 
                                                    <span className="text-[#9CA3AF] font-normal mx-1">→</span> 
                                                    {conv.store?.name}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-[#F59E0B] font-medium mb-1">Order #{conv.order?.id.slice(-6)}</p>
                                            <p className="text-sm text-[#6B7280] truncate">
                                                {conv.messages?.[0]?.body || "No messages yet"}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`w-full md:w-2/3 bg-[#F9FAFB] flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                    {selectedConversation ? (
                        <div className="h-full p-4">
                            <ChatWidget 
                                conversationId={selectedConversation.id} 
                                buyerName={selectedConversation.buyer?.name}
                                storeName={selectedConversation.store?.name}
                                isAdmin={true}
                                onClose={() => setSelectedConversation(null)}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[#9CA3AF]">
                            <MessageSquareIcon className="w-12 h-12 mb-4 opacity-30" />
                            <h2 className="text-lg font-medium text-[#4B5563]">No Conversation Selected</h2>
                            <p className="text-sm mt-1">Select a conversation from the list to view or moderate.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

