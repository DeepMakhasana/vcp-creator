import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/auth/authProvider.tsx";
import "react-toastify/dist/ReactToastify.min.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * (60 * 1000),
      gcTime: 60 * (60 * 1000),
      refetchOnWindowFocus: false, // Disable refetching on window focus
      refetchOnMount: false, // Disable refetching on mount
      retry: 3, // Retry failed requests up to 3 times
      retryDelay: 2000, // 2-second delay between retries
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
        {/* toaster notification */}
        <ToastContainer />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
