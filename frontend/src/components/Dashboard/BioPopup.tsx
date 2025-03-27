import { useState } from "react";

interface BioModalProps {
  username: string;
  onClose: () => void;
}

const BioPopup: React.FC<BioModalProps> = ({ username, onClose }) => {
  const [newBio, setNewBio] = useState("");

  // Handle bio update
  const handleUpdateBio = async () => {
    try {
      const response = await fetch(
        `profiles/bio/${username}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bio: newBio }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Bio.");
      }

      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error updating bio:", error);
      alert("Failed to update bio.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg border border-black p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-lg font-bold text-center">Update bio</h2>
        <p className="text-sm text-gray-600 text-center mt-2">
          Enter a new bio for your account.
        </p>

        <textarea
          placeholder="New Bio"
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
          className="w-full mt-4 border border-black p-2 rounded focus:outline-none focus:ring-1 focus:ring-mint"
          rows={4}
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 border border-black rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateBio}
            className="px-4 py-2 bg-mint border border-black rounded text-black hover:bg-minter transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BioPopup;
