import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import ResetPasswordPopup from "./PasswordPopup";

const SettingComp: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <p>Loading profile...</p>;
  }

  const { user, updateUser } = authContext;

  // Initialize formData state
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    yorkId: "",
    phoneNumber: "",
    email: "",
  });

  // Sync user data when it loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        yorkId: user.yorkId || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
      });
    }
  }, [user]); // Runs when `user` changes

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update all fields in one request
  const handleUpdate = async () => {
    console.log("Updating user with:", formData);
    await updateUser(formData);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex flex-col items-center bg-grey-50 border b-black rounded-lg w-full">
      <div className="bg-grey rounded-t-lg border-b b-black text-center font-fancy py-1 text-xl w-full">
        User Settings
      </div>

      {/* Main Section */}
      <div className="p-6 w-full">
        {Object.keys(formData).map((field) => (
          <div key={field} className="grid grid-cols-[1fr_3fr]">
            <p>{field.charAt(0).toUpperCase() + field.slice(1)}</p>
            <div className="flex flex-row items-center justify-between gap-2 w-full pb-2 mt-1">
              <input
                type="text"
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="border-b border-black w-[85%] rounded focus:outline-none focus:ring-1 focus:ring-mint"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Update All Button */}
      <button
        onClick={handleUpdate}
        className="self-center mt-1 cursor-pointer w-[40%] px-3 py-2 bg-mint border border-black text-black rounded-lg hover:bg-minter transition-colors duration-300"
      >
        Update Profile
      </button>
        
      <button
        onClick={() => setIsModalOpen(true)}
        className="self-center mt-5 cursor-pointer w-[40%] px-3 py-2 bg-light-red border border-black text-black rounded-lg hover:bg-red/50 transition-colors duration-300"
      >
        Reset Password
      </button>

      {/* Show Reset Password Modal when triggered */}
      {isModalOpen && user && (
        <ResetPasswordPopup username={user.username} onClose={() => setIsModalOpen(false)} />
      )}
    </main>
  );
};

export default SettingComp;

