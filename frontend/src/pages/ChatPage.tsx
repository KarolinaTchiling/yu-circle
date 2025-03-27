import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header/Header";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string; // Adjust the type as needed
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
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize with a default chat tab if none exist
    if (chatTabs.length === 0) {
      setChatTabs([{ username: "", messages: [] }]);
      setActiveTab("");
    }
  }, [isAuthenticated, chatTabs, navigate]);

  useEffect(() => {
    if (!user || !activeTab) return;

    fetchConversation(activeTab);
  }, [user, activeTab]);

  const fetchConversation = async (receiver: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/messages/get?user1=${user.username}&user2=${receiver}`);
      console.log(response);
      if (!response.ok) throw new Error("Failed to fetch conversation");
      const data = await response.json();
      setChatTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.username === receiver ? { ...tab, messages: data } : tab
        )
      );
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

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

  const handleDeleteMessage = async (id: number) => {
    if (!user || !activeTab) return;

    try {
      const response = await fetch(`/messages/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete message");
      fetchConversation(activeTab); // Refresh the conversation after deleting a message
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleCreateNewChat = (username: string) => {
    if (chatTabs.some((tab) => tab.username === username)) {
      setActiveTab(username);
      return;
    }
    setChatTabs((prevTabs) => [...prevTabs, { username, messages: [] }]);
    setActiveTab(username);
  };

  const handleAddChat = () => {
    if (newChatUsername.trim()) {
      handleCreateNewChat(newChatUsername);
      setNewChatUsername("");
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
                  className={`p-3 bg-gray-300 border rounded-lg mb-2 cursor-pointer ${activeTab === tab.username ? "bg-gray-200" : ""
                    }`}
                  onClick={() => setActiveTab(tab.username)}
                >
                  <p className="font-bold text-black-800">{tab.username}</p>
                  <p className="text-gray-600 text-sm">
                    {tab.messages.length > 0 ? tab.messages[tab.messages.length - 1].content : "No messages yet"}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Requests List */}
          <div className="p-4 border bg-white rounded-lg">
            <h2 className="text-lg font-bold mb-2">Requests</h2>
            <div className="p-3 border rounded-lg flex justify-between items-center bg-gray-100">
              <div>
                <p className="font-bold text-black-800">Brit</p>
                <p className="text-sm">Community Match Request</p>
              </div>
              <div>
                <button className="text-lg mr-2">✖</button>
                <button className="text-lg">✔</button>
              </div>
            </div>
            <div className="mt-2 p-3 border rounded-lg flex justify-between items-center bg-gray-100">
              <div>
                <p className="font-bold text-black-800">Mike</p>
                <p className="text-sm">Inquiring about tutoring</p>
              </div>
              <div>
                <button className="text-lg mr-2">✖</button>
                <button className="text-lg">✔</button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        {activeTab && (
          <div className="w-2/3 bg-white p-4 flex flex-col border rounded-lg">
            <h2 className="text-lg font-bold p-2 rounded">Chat with {activeTab}</h2>
            <input type="text" placeholder="Search Messages" className="w-full p-2 border rounded-lg my-2" />
            <div className="flex-grow overflow-y-auto bg-white p-4 border rounded-lg">
              {chatTabs.find((tab) => tab.username === activeTab)?.messages.map((msg) => (
                <div key={msg.id} className={`mb-4 flex ${msg.sender === user?.username ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${msg.sender === user?.username ? "bg-gray-300" : "text-white bg-[var(--color-red)]"}`}>
                    <p>{msg.content}</p>
                    <button onClick={() => handleDeleteMessage(msg.id)} className="text-sm text-gray-500">Delete</button>
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