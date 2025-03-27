import React, { useState, useEffect, useContext, useRef } from "react";
import Header from "../components/Header/Header";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
}

interface ChatTab {
  username: string;
  messages: Message[];
}

const ChatPage: React.FC = () => {
  const [chatTabs, setChatTabs] = useState<ChatTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [newChatUsername, setNewChatUsername] = useState("");
  const { user, isAuthenticated } = useContext(AuthContext)!; // Assuming you have a user context
  const chatWindowRef = useRef<HTMLDivElement | null>(null);

  // Function to load chat tabs from the API
  const loadChatTabs = async () => {
    if (!user) return;

    try {
      const sentResponse = await fetch(`/messages/sent?sender=${user.username}`);
      const receivedResponse = await fetch(`/messages/received?receiver=${user.username}`);

      if (!sentResponse.ok || !receivedResponse.ok) {
        throw new Error("Failed to fetch messages");
      }

      const sentMessages: Message[] = await sentResponse.json();
      const receivedMessages: Message[] = await receivedResponse.json();

      const allMessages = [...sentMessages, ...receivedMessages];

      // Extract unique usernames from messages
      const uniqueUsernames = new Set<string>();
      allMessages.forEach((msg) => {
        if (msg.sender !== user.username) {
          uniqueUsernames.add(msg.sender);
        }
        if (msg.receiver !== user.username) {
          uniqueUsernames.add(msg.receiver);
        }
      });

      // Create chat tabs based on unique usernames
      const newChatTabs: ChatTab[] = Array.from(uniqueUsernames).map((username) => ({
        username,
        messages: allMessages.filter((msg) => (msg.sender === username || msg.receiver === username)).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      }));

      setChatTabs(newChatTabs);
      if (newChatTabs.length > 0) {
        setActiveTab(newChatTabs[0].username);
      }
    } catch (error) {
      console.error("Error fetching messages from the API:", error);
    }
  };

  // Function to fetch conversation from the API
  const fetchConversation = async (receiver: string) => {
    if (!user) return;

    try {
      const sentResponse = await fetch(`/messages/sent?sender=${user.username}`);
      const receivedResponse = await fetch(`/messages/received?receiver=${user.username}`);

      if (!sentResponse.ok || !receivedResponse.ok) {
        throw new Error("Failed to fetch conversation");
      }

      const sentMessages: Message[] = await sentResponse.json();
      const receivedMessages: Message[] = await receivedResponse.json();

      const allMessages = [...sentMessages, ...receivedMessages];

      const messages = allMessages.filter((msg) => (msg.sender === receiver || msg.receiver === receiver)).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      setChatTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.username === receiver ? { ...tab, messages } : tab
        )
      );
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadChatTabs();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!user || !activeTab) return;

    fetchConversation(activeTab);
  }, [user, activeTab]);

  useEffect(() => {
    // Scroll to the bottom of the chat window when messages change
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatTabs, activeTab]);

  const handleSendMessage = async () => {
    if (!user || !activeTab) return;

    if (input.trim()) {
      try {
        const response = await fetch("/messages/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: user.username,
            receiver: activeTab,
            content: input,
          }),
        });
        if (!response.ok) throw new Error("Failed to send message");
        setInput("");
        fetchConversation(activeTab); // Refresh the conversation after sending a message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleCreateNewChat = async (username: string) => {
    if (!user) return;

    // Check if the chat tab already exists
    const chatTabExists = chatTabs.some((tab) => tab.username === username);
    if (chatTabExists) {
      setActiveTab(username);
      return;
    }

    // Create a new chat tab
    setChatTabs((prevTabs) => [
      ...prevTabs,
      { username, messages: [] },
    ]);
    setActiveTab(username);
  };

  const handleAddChat = () => {
    if (newChatUsername.trim()) {
      handleCreateNewChat(newChatUsername);
      setNewChatUsername("");
    }
  };

  const handleDeleteChat = async (username: string) => {
    if (!user) return;

    try {
      // Fetch all messages for the chat
      const sentResponse = await fetch(`/messages/sent?sender=${user.username}`);
      const receivedResponse = await fetch(`/messages/received?receiver=${user.username}`);

      if (!sentResponse.ok || !receivedResponse.ok) {
        throw new Error("Failed to fetch messages");
      }

      const sentMessages: Message[] = await sentResponse.json();
      const receivedMessages: Message[] = await receivedResponse.json();

      const allMessages = [...sentMessages, ...receivedMessages];

      // Filter messages for the specific chat
      const chatMessages = allMessages.filter((msg) => (msg.sender === username || msg.receiver === username));

      // Delete each message
      for (const msg of chatMessages) {
        const deleteResponse = await fetch(`/messages/delete/${msg.id}`, {
          method: "DELETE",
        });
        if (!deleteResponse.ok) {
          throw new Error("Failed to delete message");
        }
      }

      // Remove the chat tab
      setChatTabs((prevTabs) =>
        prevTabs.filter((tab) => tab.username !== username)
      );
      if (activeTab === username) {
        setActiveTab(null);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen rounded-lg overflow-hidden">
      <Header />
      <div className="flex flex-grow mt-2 rounded-lg space-x-4 p-4">
        {/* Chats List */}
        <div className="w-1/3 flex flex-col space-y-4">
          <div className="bg-white border p-4 flex flex-col rounded-lg">
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-2">New Chat</h2>
              <div className="flex items-center">
                <input
                  type="text"
                  value={newChatUsername}
                  onChange={(e) => setNewChatUsername(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="Enter username"
                />
                <button
                  onClick={handleAddChat}
                  className="ml-2 px-4 py-2 bg-[var(--color-red)] text-white rounded-lg hover:bg-red-700"
                >
                  Add Chat
                </button>
              </div>
            </div>
            <br></br>
            <h2 className="text-lg font-bold mb-4">Chats</h2>
            <div className="flex-col flex-grow overflow-auto">
              {chatTabs.map((tab) => (
                <div
                  key={tab.username}
                  className={`p-3 bg-gray-300 border rounded-lg mb-2 cursor-pointer 
                    ${activeTab === tab.username ? "bg-gray-200 border-l-4 border-[var(--color-red)]" : ""
                    }`}
                  onClick={() => setActiveTab(tab.username)}
                >
                  <p className="font-bold text-black-800">{tab.username}</p>
                </div>
              ))}
              {chatTabs.length === 0 && (
                <div className="p-3 bg-gray-100 border rounded-lg mb-2 text-center">
                  <p className="text-gray-600">No messages, start a new one!</p>
                </div>
              )}
            </div>
          </div>
          {/* Requests List */}
        </div>

        {/* Chat Window */}
        {activeTab && (
          <div className="w-2/3 bg-white p-4 flex flex-col border rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold p-2 rounded">Chat with {activeTab}</h2>
              <button
                onClick={() => handleDeleteChat(activeTab)}
                className="px-4 py-2 text-white rounded-lg bg-[var(--color-red)] hover:bg-red-700"
              >
                Delete Chat
              </button>
            </div>
            <div className="flex-grow overflow-y-auto bg-white p-4 border rounded-lg" ref={chatWindowRef}>
              {chatTabs.find((tab) => tab.username === activeTab)?.messages?.map((msg: any) => (
                <div key={msg.id} className={`mb-4 flex ${msg.sender === user?.username ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${msg.sender === user?.username ? "bg-gray-300" : "text-white bg-[var(--color-red)]"}`}>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="Type your message"
              />
              <button onClick={handleSendMessage} className="ml-2 px-4 py-2 bg-[var(--color-red)] text-white rounded-lg hover:bg-red-700">
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;