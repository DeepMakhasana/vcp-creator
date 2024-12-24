import { useContext } from "react";
import AuthContext, { AuthContextType } from "./authContext";

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};

export default useAuthContext;
