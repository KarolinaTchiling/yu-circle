import { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
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
      const firstName = allUserInfo.firstname
      const lastName = allUserInfo.lastname
      const yorkID = allUserInfo.yorkID
      const email = allUserInfo.email
      const phoneNumber = allUserInfo.phoneNumber
      const createdAt = allUserInfo.createdAt
      const isAdmin = allUserInfo.isAdmin
      
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

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
