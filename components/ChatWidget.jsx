'use client'

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useAuth, useUser } from "@clerk/nextjs"
import { SendIcon, XIcon, MessageSquareIcon } from "lucide-react"

export default function ChatWidget({ orderId, conversationId, onClose, storeName, buyerName }) {
    const { getToken } = useAuth()
    const { user } = useUser()
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [activeConvId, setActiveConvId] = useState(conversationId)
    const messagesEndRef = useRef(null)

    const fetchMessages = async () => {
        try {
            const token = await getToken()
            const url = activeConvId 
                ? `/api/messages?conversationId=${activeConvId}`
                : `/api/messages?orderId=${orderId}`
            
            const { data } = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            if (data.messages) {
                setMessages(data.messages)
            }
            if (data.conversationId && !activeConvId) {
                setActiveConvId(data.conversationId)
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchMessages()
            // Poll every 10 seconds
            const interval = setInterval(fetchMessages, 10000)
            return () => clearInterval(interval)
        }
    }, [user, activeConvId, orderId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        // Optimistic UI update
        const tempMsg = {
            id: Date.now().toString(),
            body: newMessage,
            senderId: user.id,
            createdAt: new Date().toISOString()
        }
        setMessages(prev => [...prev, tempMsg])
        setNewMessage("")

        try {
            const token = await getToken()
            const payload = activeConvId ? { conversationId: activeConvId, body: tempMsg.body } : { orderId, body: tempMsg.body }
            
            const { data } = await axios.post("/api/messages", payload, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            if (!activeConvId && data.message.conversationId) {
                setActiveConvId(data.message.conversationId)
            }
        } catch (error) {
            console.error("Failed to send message:", error)
            // Ideally remove optimistic message or show error
        }
    }

    return (
        <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-[600px]">
            {/* Header */}
            <div className="bg-[#1E1B4B] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquareIcon className="w-5 h-5" />
                    <h3 className="font-semibold font-[family-name:var(--font-heading)]">
                        {storeName ? `Chat with ${storeName}` : buyerName ? `Chat with ${buyerName}` : 'Order Chat'}
                    </h3>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-gray-500">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageSquareIcon className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === user?.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-[#F59E0B] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                                    {msg.body}
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                />
                <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-[#1E1B4B] text-white p-2.5 rounded-full hover:bg-[#312E81] transition-colors disabled:opacity-50"
                >
                    <SendIcon className="w-4 h-4" />
                </button>
            </form>
        </div>
    )
}
