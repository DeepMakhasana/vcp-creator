import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import AuthContext from "./authContext";
import { User } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { constants } from "@/lib/constants";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const authenticateUser = useCallback(() => {
    const token = getToken();
    if (token) {
      const decodedUser: User = jwtDecode(token);
      if (decodedUser.userRole === "creator") {
        setIsAuthenticated(true);
        setUser(decodedUser);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const getToken = () => {
    return localStorage.getItem(constants.TOKEN);
  };

  const setToken = (value: string) => {
    return localStorage.setItem(constants.TOKEN, value);
  };

  const login = (token: string) => {
    if (token) {
      setIsAuthenticated(true);
      setToken(token);
      const decodedUser: User = jwtDecode(token);
      setUser(decodedUser);
    }
  };

  const logout = () => {
    setToken("");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    authenticateUser();
  }, [authenticateUser]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, setUser, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
