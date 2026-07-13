'use client'

import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { MessageSquareIcon, SearchIcon, AlertCircleIcon } from "lucide-react"
import ChatWidget from "@/components/ChatWidget"

export default function StoreMessagesPage() {
    const { user } = useUser()
    const { getToken } = useAuth()
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [search, setSearch] = useState("")

    const fetchConversations = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get("/api/conversations", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setConversations(data.conversations || [])
        } catch (error) {
            console.error("Failed to fetch conversations:", error)
            toast.error("Failed to load messages")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchConversations()
            // Optional: slow polling for conversations list
            const interval = setInterval(fetchConversations, 30000)
            return () => clearInterval(interval)
        }
    }, [user])

    const filteredConversations = conversations.filter(c => 
        c.buyer?.name.toLowerCase().includes(search.toLowerCase()) || 
        c.order?.id.includes(search)
    )

    return !loading ? (
        <div className="h-[calc(100vh-100px)] flex flex-col -mx-4 sm:-mx-6 -mt-6">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 bg-white">
                <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E1B4B]">
                    Messages
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">Chat directly with buyers regarding their orders.</p>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Conversations List */}
                <div className={`w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <SearchIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search by name or order ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#1E1B4B]"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No conversations found.
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <button 
                                    key={conv.id}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedConversation?.id === conv.id ? 'bg-[#EEF2FF]' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#1E1B4B] text-white flex items-center justify-center font-bold">
                                            {conv.buyer?.name?.[0] || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className="font-semibold text-gray-900 truncate">{conv.buyer?.name}</h3>
                                            </div>
                                            <p className="text-xs text-[#F59E0B] font-medium mb-1">Order #{conv.order?.id.slice(-6)}</p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {conv.messages[0]?.body || "No messages yet"}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`w-full md:w-2/3 bg-gray-50 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                    {selectedConversation ? (
                        <div className="h-full">
                            {/* We re-use ChatWidget but pass conversationId directly and don't render a close button on desktop */}
                            <ChatWidget 
                                conversationId={selectedConversation.id} 
                                buyerName={selectedConversation.buyer?.name}
                                onClose={() => setSelectedConversation(null)} // Allows mobile users to go back
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <MessageSquareIcon className="w-12 h-12 mb-4 opacity-30" />
                            <h2 className="text-lg font-medium text-gray-600">No Conversation Selected</h2>
                            <p className="text-sm">Select a buyer from the list to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : <Loading />
}
