import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import { Send, X, Minus, MessageSquare, ChevronLeft } from 'lucide-react'
import { ChatInboxTab } from './ChatInboxTab'
import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export const ChatWindow = () => {
    const { 
        activeChat, setActiveChat, 
        messages, sendMessage, 
        connected, rooms,
        isLauncherOpen, setIsLauncherOpen 
    } = useChat()
    
    const { user } = useAuth()
    const [input, setInput] = useState('')
    const scrollRef = useRef(null)
    const location = useLocation()

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, activeChat, isLauncherOpen])

    // Hide chat window if user is not logged in OR if on auth-related pages
    const hiddenPaths = ['/login', '/register', '/forgot-password', '/reset-password']
    if (!user || hiddenPaths.includes(location.pathname)) return null

    // Helper to calculate other user info for the header
    const handleSend = (e) => {
        e.preventDefault()
        if (!input.trim() || !connected) return
        sendMessage(activeChat.recipientId, input)
        setInput('')
    }

    // ─── 1. Closed Bubble View ───
    if (!isLauncherOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <button 
                    onClick={() => setIsLauncherOpen(true)}
                    className="group relative flex items-center justify-center w-14 h-14 bg-brand text-white rounded-full shadow-[0_8px_30px_rgb(205,133,63,0.4)] hover:scale-110 active:scale-95 transition-all duration-300"
                >
                    <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
                    {/* Unread indicator placeholder? */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                </button>
            </div>
        )
    }

    // ─── 2. Open Inbox View (If no active chat) ───
    if (isLauncherOpen && !activeChat) {
        return (
            <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-surface border border-border rounded-[32px] shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
                <div className="bg-brand px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="font-black text-lg">Messages</h3>
                    <button onClick={() => setIsLauncherOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <ChatInboxTab />
                </div>
            </div>
        )
    }

    // ─── 3. Active Chat View ───
    const chatMessages = messages[activeChat.roomId] || []
    return (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-surface border border-border rounded-[32px] shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-brand px-4 py-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setActiveChat(null)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-sm leading-tight truncate w-32">{activeChat.recipientName}</span>
                        <span className="text-[10px] opacity-80 uppercase tracking-tighter">Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsLauncherOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors"><X size={18} /></button>
                </div>
            </div>

            {/* Messages */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface text-title scroll-smooth custom-scrollbar"
            >
                {chatMessages.length === 0 && (
                    <div className="text-center py-10 opacity-40">
                        <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-xs">Start a conversation with {activeChat.recipientName}</p>
                    </div>
                )}
                {chatMessages.map((m, i) => {
                    const isMe = user && m.senderId === user.userId
                    return (
                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                            <div className={`max-w-[85%] px-4 py-2.5 rounded-[20px] text-sm leading-relaxed shadow-sm ${
                                isMe 
                                    ? 'bg-brand text-white rounded-br-none' 
                                    : 'bg-brand-50 text-title rounded-bl-none border border-brand-100'
                            }`}>
                                {m.content}
                                <div className={`text-[9px] mt-1 font-bold opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-border bg-surface flex items-center gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    autoFocus
                    className="flex-1 bg-surface-hover border border-border rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-title placeholder:text-muted/50"
                />
                <button 
                    disabled={!connected || !input.trim()}
                    className="w-10 h-10 flex items-center justify-center bg-brand text-white rounded-xl hover:bg-brand-hover disabled:opacity-30 transition-all active:scale-90 shadow-lg shadow-brand/20"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    )
}
