import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import RootLayout from "./RootLayout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Courses from "./pages/dashboard/course/Courses";
import Students from "./pages/dashboard/Students";
import Purchase from "./pages/dashboard/Purchase";
import CourseModules from "./pages/dashboard/course/CourseModules";
import CourseLessons from "./pages/dashboard/course/CourseLessons";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import "./App.css";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Lesson from "./pages/dashboard/course/Lesson";

// Creating the router with route configurations
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      // Catch-all for unknown routes under this section
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/dashboard",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "courses", element: <Courses /> },
      { path: "courses/:courseId/modules", element: <CourseModules /> },
      { path: "courses/:courseId/modules/:moduleId/lessons", element: <CourseLessons /> },
      { path: "courses/:courseId/modules/:moduleId/lessons/:lessonId", element: <Lesson /> },
      { path: "students", element: <Students /> },
      { path: "purchases", element: <Purchase /> },
      // Catch-all for unknown routes under dashboard section
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
