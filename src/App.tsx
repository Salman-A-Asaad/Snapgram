// Importing layout components and page components
import AuthLayout from "./_auth/AuthLayout";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import RootLayout from "./_root/RootLayout";
import {
  Home,
  Explore,
  Saved,
  CreatePost,
  Profile,
  EditPost,
  PostDetails,
  UpdateProfile,
  AllUsers,
} from "./_root/pages";

// Importing global styles
import "./globals.css";

// Importing React Router components
import { Routes, Route, Navigate } from "react-router-dom";

// Importing UI toaster component
import { Toaster } from "@/components/ui/toaster";
import { useUserContext } from "./context/AuthContext";

// Main component representing the entire application
function App() {
  const { isAuthenticated } = useUserContext();
  return (
    // Main container with flex layout
    <main className="flex h-screen">
      {/* React Router routes */}
      <Routes>
        {/* Routes for authentication */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
        {/* Routes for authenticated users */}
        <Route element={<RootLayout />}>
          <Route
            index
            element={isAuthenticated ? <Home /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/explore"
            element={isAuthenticated ? <Explore /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/saved"
            element={isAuthenticated ? <Saved /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/all-users"
            element={
              isAuthenticated ? <AllUsers /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/create-post"
            element={
              isAuthenticated ? <CreatePost /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/update-post/:id"
            element={
              isAuthenticated ? <EditPost /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/posts/:id"
            element={
              isAuthenticated ? <PostDetails /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/profile/:id/*"
            element={isAuthenticated ? <Profile /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/update-profile/:id"
            element={
              isAuthenticated ? <UpdateProfile /> : <Navigate to="/sign-in" />
            }
          />
        </Route>
      </Routes>
      {/* Toaster component for displaying notifications */}
      <Toaster />
    </main>
  );
}

export default App;
