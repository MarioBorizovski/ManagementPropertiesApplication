import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'
import { chatAPI } from '../api/services'

const ChatContext = createContext(null)

export const ChatProvider = ({ children }) => {
    const { user, token } = useAuth()
    const [messages, setMessages] = useState({}) // roomId -> [messages]
    const [activeChat, setActiveChat] = useState(null)
    const [rooms, setRooms] = useState([])
    const [connected, setConnected] = useState(false)
    const [isLauncherOpen, setIsLauncherOpen] = useState(false)
    const stompClient = useRef(null)

    useEffect(() => {
        if (user && token) {
            connect()
            loadUserRooms()
        } else {
            disconnect()
        }
        return () => disconnect()
    }, [user, token])

    const connect = () => {
        const wsUrl = import.meta.env.VITE_API_URL 
            ? import.meta.env.VITE_API_URL.replace('/api', '/ws') 
            : '/ws'
        const socket = new SockJS(wsUrl)
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            onConnect: () => {
                setConnected(true)
                // Subscribe to private queue
                stompClient.current.subscribe(`/user/${user.userId}/queue/messages`, (message) => {
                    const payload = JSON.parse(message.body)
                    onMessageReceived(payload)
                })
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message'])
                console.error('Additional details: ' + frame.body)
            }
        })
        stompClient.current.activate()
    }

    const disconnect = () => {
        if (stompClient.current) {
            stompClient.current.deactivate()
            setConnected(false)
        }
    }

    const loadUserRooms = async () => {
        try {
            const { data } = await chatAPI.getRooms(user.userId)
            setRooms(data)
        } catch (err) {
            console.error("Failed to load rooms", err)
        }
    }

    const onMessageReceived = (msg) => {
        const roomId = msg.chatRoomId
        setMessages(prev => ({
            ...prev,
            [roomId]: [...(prev[roomId] || []), msg]
        }))
        
        setRooms(prev => {
            if (!prev.some(r => r.chatId === roomId)) {
                setTimeout(loadUserRooms, 500)
            }
            return prev
        })

        if (activeChat?.roomId !== roomId) {
            toast.success(`New message from ${msg.senderName}`, {
                icon: '💬',
                position: 'bottom-right'
            })
        }
    }

    const sendMessage = (recipientId, content) => {
        if (stompClient.current && connected) {
            const chatMessage = {
                sender: { id: user.userId },
                recipient: { id: recipientId },
                content: content,
                timestamp: new Date()
            }
            stompClient.current.publish({
                destination: "/app/chat",
                body: JSON.stringify(chatMessage)
            })
            
            // Optimistic update
            const tempRoomId = [Math.min(user.userId, recipientId), Math.max(user.userId, recipientId)].join('_')
            const optimisticMsg = {
                ...chatMessage,
                senderId: user.userId,
                senderName: `${user.firstName} ${user.lastName}`,
                recipientId,
                chatRoomId: tempRoomId,
                status: 'SENDING'
            }
            setMessages(prev => ({
                ...prev,
                [tempRoomId]: [...(prev[tempRoomId] || []), optimisticMsg]
            }))
            
            setRooms(prev => {
                if (prev.some(r => r.chatId === tempRoomId)) return prev
                return [...prev, {
                    id: Date.now(), // pessimistic unique id
                    chatId: tempRoomId,
                    senderId: user.userId,
                    senderName: `${user.firstName} ${user.lastName}`,
                    recipientId: activeChat?.recipientId || recipientId,
                    recipientName: activeChat?.recipientName || 'New User'
                }]
            })
        }
    }

    const loadHistory = async (senderId, recipientId) => {
        try {
            const { data } = await chatAPI.getMessages(senderId, recipientId)
            const roomId = [Math.min(senderId, recipientId), Math.max(senderId, recipientId)].join('_')
            setMessages(prev => ({ ...prev, [roomId]: data }))
        } catch (err) {
            console.error("Failed to load history", err)
        }
    }

    const value = {
        messages,
        activeChat,
        setActiveChat,
        rooms,
        connected,
        isLauncherOpen,
        setIsLauncherOpen,
        sendMessage,
        loadHistory
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => useContext(ChatContext)
