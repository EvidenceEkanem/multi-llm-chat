import styles from "./App.module.css";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Assistant } from "./components/Assistant/Assistant";
import { Theme } from "./components/Theme/Theme";
import { Chat } from "./components/Chat/Chat";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [assistant, setAssistant] = useState();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState();

  useEffect(() => {
    handleNewChatCreate();
  }, []);

  const activeChatMessages = useMemo(() => {
    return chats.find((chat) => chat.id === activeChatId)?.messages ?? [];
  }, [activeChatId, chats]);

  function handleAssistantChange(newAssistant) {
    setAssistant(newAssistant);
  }

  function handleChatMessagesUpdate(chatId, messages) {
    const title = messages[0]?.content.split(" ").slice(0, 7).join(" ");

    setChats((prevChats) => [...prevChats.map((prevChat) => 
      prevChat.id === chatId ? { ...prevChat, title: prevChat.title ?? title, messages } : prevChat
    )])
  }

  function handleNewChatCreate() {
    const id = uuidv4();
    setActiveChatId(id);
    setChats((prevChats) => [...prevChats, { 
      id,
      messages: []
    }])
  }

  function handleActiveChatIdChange(id) {
  setActiveChatId(id);
  setChats((prevChats) => prevChats.filter(({ messages }) => messages.length > 0));
}
  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img src="/chat-bot.png" className={styles.Logo} />
        <h2 className={styles.Title}>AI Chatbot</h2> 
      </header>

      <div className={styles.Content}>
        <Sidebar 
          chats={chats} 
          activeChatId={activeChatId} 
          onActiveChatIdChange={handleActiveChatIdChange}
          activeChatMessages={activeChatMessages}
          onNewChatCreate={handleNewChatCreate}
        />

        <main className={styles.Main}>
          {chats.map((chat) => (
              <Chat 
                key={chat.id}
                assistant={assistant} 
                isActive={chat.id === activeChatId}
                chatMessages={chat.messages} 
                chatId={chat.id} 
                onChatMessagesUpdate={handleChatMessagesUpdate}
              />
          ))}

          <div className={styles.Configuration}>
            <Assistant onAssistantChange={handleAssistantChange} />
            <Theme />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
