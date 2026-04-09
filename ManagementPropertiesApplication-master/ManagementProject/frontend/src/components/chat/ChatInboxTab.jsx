import React from 'react'
import { useChat } from '../../context/ChatContext'
import { MessageSquare, User, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const ChatInboxTab = () => {
    const { rooms, setActiveChat, loadHistory } = useChat()
    const { user } = useAuth()

    const handleRoomClick = (room) => {
        const otherUserId = room.senderId === user.userId ? room.recipientId : room.senderId
        const otherUserName = room.senderId === user.userId ? room.recipientName : room.senderName

        setActiveChat({
            roomId: room.chatId,
            recipientId: otherUserId,
            recipientName: otherUserName
        })
        loadHistory(user.userId, otherUserId)
    }

    if (rooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-3xl border border-border-warm">
                <div className="w-16 h-16 bg-brand-50 text-brand rounded-full flex items-center justify-center mb-4">
                    <MessageSquare size={32} />
                </div>
                <h3 className="text-lg font-bold text-title">No conversations yet</h3>
                <p className="text-muted text-sm max-w-xs text-center mt-2">
                    When guests message you about your properties, they will appear here.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3">
                {rooms.map(room => {
                    const isSender = room.senderId === user.userId
                    const otherUserName = isSender ? room.recipientName : room.senderName
                    
                    return (
                        <div 
                            key={room.id}
                            onClick={() => handleRoomClick(room)}
                            className="bg-surface p-6 rounded-[24px] border border-border-warm hover:shadow-lg hover:shadow-brand-500/5 transition-all cursor-pointer group flex items-center gap-4"
                        >
                            <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                                <User size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-title group-hover:text-brand transition-colors">
                                    {otherUserName}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                                    <Clock size={12} />
                                    <span>Active conversation</span>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-muted group-hover:text-brand">
                                <MessageSquare size={16} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
