import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  username: string;
  firstname: string;
  lastname: string;
  yorkId: string;
  email: string;
  phoneNumber: string;
  userBio: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create the context with an empty default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`/profiles/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginResponse = await response.text();
      
      if (!response.ok || loginResponse.trim() !== "Authentication successful") {
        throw new Error(loginResponse || "Invalid credentials");
      }

      const response2 = await fetch(`/profiles/${username}`, { method: "GET" });
      const allUserInfo: User = await response2.json();

      localStorage.setItem("user", JSON.stringify(allUserInfo)); 
      setUser(allUserInfo);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

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
      const updatedUser = {
        firstname: updatedFields.firstname ?? user.firstname,
        lastname: updatedFields.lastname ?? user.lastname,
        yorkId: updatedFields.yorkId ?? user.yorkId,
        email: updatedFields.email ?? user.email,
        phoneNumber: updatedFields.phoneNumber ?? user.phoneNumber,
      };

      console.log("Sending update request:", updatedUser);

      const response = await fetch(`/profiles/${user.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const responseData = await response.json();
      console.log("Response from server:", responseData);

      setUser(responseData);
      localStorage.setItem("user", JSON.stringify(responseData));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
