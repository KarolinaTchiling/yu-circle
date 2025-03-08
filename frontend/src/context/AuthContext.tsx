import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  username: string;
  firstName: string;
  lastName: string;
  yorkID: string;
  email: string;
  phoneNumber: string;
  createdAt: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

// Create the context with an empty default value (not authenticated, no user logged in)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // check cookies to see if login cookies exist already
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // re-use login function to do login
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/profiles/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginResponse = await response.text();
      
      if (!response.ok || loginResponse.trim() !== "Authentication successful") {
        throw new Error(loginResponse || "Invalid credentials");
      }

      const response2URL = `/profiles/${username}`;
      const response2 = await fetch(response2URL, {
        method: "GET",
      });

      // parse all JSON fields
      const allUserInfo = await response2.json();

      const firstName = allUserInfo.firstname;
      const lastName = allUserInfo.lastname;
      const yorkID = allUserInfo.yorkId;
      const email = allUserInfo.email;
      const phoneNumber = allUserInfo.phoneNumber;
      const createdAt = allUserInfo.createdAt;
      const isAdmin = allUserInfo.isAdmin;
      
      if (!response.ok || loginResponse.trim() !== "Authentication successful") {
        throw new Error(loginResponse || "Invalid credentials");
      }

      // store all user data in cookies (for later, i.e. dashboard)
      const userData = { username, firstName, lastName, yorkID, email, phoneNumber, createdAt, isAdmin };
      localStorage.setItem("user", JSON.stringify(userData)); 
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // logout from webpage (set user to null, delete cookies)
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (updatedFields: Partial<User>) => {
    if (!user) {
      console.error("No user found in context");
      return;
    }
  
    try {
        // Convert frontend fields to backend-compatible fields
        const updatedUser = {
          firstname: updatedFields.firstName ?? user.firstName,
          lastname: updatedFields.lastName ?? user.lastName,
          yorkId: updatedFields.yorkID ?? user.yorkID,
          email: updatedFields.email ?? user.email,
          phoneNumber: updatedFields.phoneNumber ?? user.phoneNumber,
        };
  
      console.log("Sending update request:", updatedUser);
  
      const response = await fetch(`/profiles/${user.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user: ${errorText}`);
      }
  
      // Ensure response contains updated user
      const responseData = await response.json();
      console.log("Response from server:", responseData);
  
      // Update user state (triggers a re-render)
      setUser(responseData);
      localStorage.setItem("user", JSON.stringify(responseData));
  
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
