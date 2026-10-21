import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setLoading(true))
            const data = await sendMessage({ message, chatId })
            const { chat, aiMessage } = data
            const activeChatId = chatId || chat?._id

            if (!chatId && chat) {
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }))
            }

            dispatch(addNewMessage({
                chatId: activeChatId,
                id: Date.now() + '-user',
                content: message,
                role: "user",
            }))

            if (aiMessage) {
                dispatch(addNewMessage({
                    chatId: activeChatId,
                    id: aiMessage._id || Date.now() + '-ai',
                    content: aiMessage.content,
                    role: aiMessage.role || "ai",
                }))
            }

            if (activeChatId) {
                dispatch(setCurrentChatId(activeChatId))
            }
        } catch (error) {
            console.error("Failed to send message:", error)
            dispatch(setError(error.response?.data?.message || "Failed to send message"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats() {
        try {
            dispatch(setLoading(true))
            const data = await getChats()
            const { chats } = data
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[ chat._id ] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                }
                return acc
            }, {})))
        } catch (err) {
            console.error("Failed to fetch chats:", err)
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleOpenChat(chatId) {
        try {
            dispatch(setCurrentChatId(chatId))
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = (messages || []).map((msg, index) => ({
                id: msg._id || `${chatId}-${index}`,
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        } catch (err) {
            console.error("Failed to get messages:", err)
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }

}