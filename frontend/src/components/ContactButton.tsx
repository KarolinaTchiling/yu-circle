import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

interface ContactButtonProps {
  receiver: string;
  className?: string;
}

const ContactButton: React.FC<ContactButtonProps> = ({ receiver, className }) => {
  const { isAuthenticated, user } = useContext(AuthContext)!;

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (!user?.username || !message.trim()) return;

    const payload = {
      sender: user.username,
      receiver,
      content: message,
    };

    try {
      const res = await fetch("/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to send message");

      alert("Message sent!");
      setMessage("");
      setIsOpen(false); // close modal
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className={
          className ??
          "font-fancy text-lg cursor-pointer py-1 px-2 w-full bg-white border border-black text-black rounded-lg hover:bg-minter transition-colors duration-300"
        }
      >
        Message
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white border border-black rounded-xl p-6 w-[400px] space-y-4">
            <h2 className="text-xl font-semibold">Message to {receiver}</h2>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Type your message..."
              className="w-full p-2 border rounded-md resize-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1 border rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-1 border rounded-md bg-minter hover:bg-mint"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactButton;