import { useState } from "react";

interface ResetPasswordModalProps {
  username: string;
  onClose: () => void;
}

const ResetPasswordPopup: React.FC<ResetPasswordModalProps> = ({ username, onClose }) => {
  const [newPassword, setNewPassword] = useState("");

  // Handle password reset
  const handleResetPassword = async () => {
    try {
      const response = await fetch(
        `profiles/changepass/${username}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password.");
      }

      alert("Password reset successfully!");
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg border border-black p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-lg font-bold text-center">Reset Password</h2>
        <p className="text-sm text-gray-600 text-center mt-2">
          Enter a new password for your account.
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mt-4 border border-black p-2 rounded focus:outline-none focus:ring-1 focus:ring-mint"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 border border-black rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleResetPassword}
            className="px-4 py-2 bg-mint border border-black rounded text-black hover:bg-minter transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPopup;
