import React, { useState } from "react";
import Header from "../components/Header/Header";

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Jason", text: "Do you want to stay back on campus Friday after class?", type: "received" },
    { id: 2, sender: "You", text: "Sure! That sounds good.", type: "sent" }
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: "You", text: input, type: "sent" }]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col w-full h-screen border rounded-lg overflow-hidden">
      <Header />
      <div className="flex flex-grow mt-2 rounded-lg space-x-4 p-4">
        {/* Chats List */}
        <div className="w-1/3 flex flex-col space-y-4">
          <div className="bg-white border p-4 flex flex-col rounded-lg">
            <h2 className="text-lg font-bold mb-4">Chats</h2>
            <input type="text" placeholder="Search Messages" className="w-full p-2 border rounded-lg mb-4" />
            <div className="flex-col flex-grow overflow-auto">
              <div className="p-3 bg-gray-300 border rounded-lg mb-2 cursor-pointer"> 
                <p className="font-bold text-black-800">Jason</p>
                <p className="text-gray-600 text-sm">Do you want to stay back on campus Friday after class?</p>
              </div>
              <div className="p-3 bg-gray-100 border rounded-lg mb-2 cursor-pointer">
                <p className="font-bold">Claire</p>
                <p className="text-gray-600 text-sm">LOL I agree that midterm was hard</p>
              </div>
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
        <div className="w-2/3 bg-white p-4 flex flex-col border rounded-lg">
          <h2 className="text-lg font-bold p-2 rounded">Jason</h2>
          <input type="text" placeholder="Search Messages" className="w-full p-2 border rounded-lg my-2" />
          <div className="flex-grow overflow-y-auto bg-white p-4 border rounded-lg">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-4 flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs p-3 rounded-lg ${msg.type === "sent" ? "bg-gray-300" : "text-white bg-[var(--color-red)]"}`}>
                  <p>{msg.text}</p>
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
      </div>
    </div>
  );
};

export default ChatUI;