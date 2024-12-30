import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect } from "react";
import useAuthContext from "./context/auth/useAuthContext";
import { allowPath } from "./lib/constants";

const RootLayout = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const path = useLocation();
  console.log(path);
  console.log("root layout");
  useLayoutEffect(() => {
    if (isAuthenticated) {
      if (allowPath.includes(path.pathname)) {
        console.log("enter--");
        navigate("/dashboard");
      }
    } else {
      if (!allowPath.includes(path.pathname)) {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate, path.pathname]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return <Outlet />;
};

export default RootLayout;
