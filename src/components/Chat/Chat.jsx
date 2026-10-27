import styles from "./Chat.module.css";
import { Messages } from "../Messages/Messages";
import { Controls } from "../Controls/Controls";
import { useEffect, useState } from "react";
import { Loader } from "../Loader/Loader";

export function Chat({ assistant, chatMessages, chatId, onChatMessagesUpdate, isActive }) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        setMessages(chatMessages);

        if(assistant?.name === "googleai") {
            assistant.createChat(chatMessages);
        }
    }, [chatId])

    useEffect(() => {
        onChatMessagesUpdate(chatId, messages);
    }, [messages])

    function updateLastMessageContent(content) {
        setMessages((prevMessages) => prevMessages.map((message, index) => index === prevMessages.length - 1 ? {
            ...message, content: `${message.content}${content}`
        } : message))
    }

    function addMessage(role, content){
        setMessages((prevMessages) => [...prevMessages, {
            content, role
        }]);
    }

    async function handleContentSend(content) {
        addMessage("user", content);

        try{
            setIsLoading(true);
            setIsStreaming(true);

            const response = await assistant.chatStream(content, messages.filter(({role}) => role !== "system"));
            
            let isFirstChunk = false;

            for await (const chunk of response) {
                if(!isFirstChunk){
                    isFirstChunk = true;
                    addMessage("assistant", "")
                    setIsLoading(false);
                }

                updateLastMessageContent(chunk)
            }

            // addMessage("assistant", response);
            setIsStreaming(false);
        } catch(error){
            addMessage("system", error?.message ?? "Sorry, I couldn't process your request. Please try again");
            setIsLoading(false);
            setIsStreaming(false);
        }
    }

    if(!isActive) {
        return null;
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className={styles.Chat}>
                <Messages messages={messages} />
            </div>

            <Controls onSend={handleContentSend} isDisabled={isLoading || isStreaming} />
        </>
    );
}