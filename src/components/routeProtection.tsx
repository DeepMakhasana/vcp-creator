import useAuthContext from "@/context/auth/useAuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const routeProtection = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const ProtectedComponent = (props: P) => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuthContext(); // Replace with your auth logic
    console.log("protect route: ", isAuthenticated);

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate("/login");
      }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
      return <p>Loading...</p>; // Show a spinner or skeleton while checking authentication
    }

    if (!isAuthenticated) {
      return null; // Render nothing or a loading spinner while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedComponent;
};

export default routeProtection;
