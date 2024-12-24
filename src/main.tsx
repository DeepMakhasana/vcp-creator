import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/auth/authProvider.tsx";
import "react-toastify/dist/ReactToastify.min.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      gcTime: 10 * (60 * 1000),
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        {/* toaster notification */}
        <ToastContainer />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
