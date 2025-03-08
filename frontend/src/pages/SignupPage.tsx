import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";

const SignupPage: React.FC = () => {

  // declare valid form fields
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    yorkId: "",
    phoneNumber: "",
  });

  // create empty states
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "yorkId" && !/^\d{0,9}$/.test(value)) return; // enforce 9 digit length
    if (name === "phoneNumber" && !/^\d{0,10}$/.test(value.replace(/\D/g, ""))) return; // restrict input to numbers only

    setFormData({ ...formData, [name]: value });
  };

  // auto-format to add dashes when you type phone number
  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length > 6
      ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
      : digits.length > 3
      ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}`
      : digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phoneNumber: formatPhoneNumber(e.target.value) });
  };

  // submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // send data to database
    try {
      const response = await fetch("/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // store response for error handling
      const rawText = await response.text();

      if (response.ok) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error(rawText || "Registration failed");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  // actual web UI
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-lg border p-3 bg-white p-8 shadow-md">
          <h1 className="text-xl font-fancy font-bold">Sign Up</h1>
          <br />
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="w-full rounded-lg border p-3 text-sm outline-none" required />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="w-full rounded-lg border p-3 text-sm outline-none" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">York ID</label>
              <input type="text" name="yorkId" value={formData.yorkId} onChange={handleChange} className="w-full rounded-lg border p-3 text-sm outline-none" placeholder="9-digit York ID" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handlePhoneChange} className="w-full rounded-lg border p-3 text-sm outline-none" placeholder="XXX-XXX-XXXX" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full rounded-lg border p-3 text-sm outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border p-3 text-sm outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full rounded-lg border p-3 text-sm outline-none" required />
            </div>
            {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
            {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
            <button type="submit" className="w-full rounded-lg bg-red-600 p-3 text-white transition hover:bg-red-700" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-red-600 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
