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
import { Loader } from "lucide-react";

// Main component representing the entire application
function App() {
  const { user, isLoading } = useUserContext();
  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex-center">
        <Loader />
      </div>
    );
  }
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
          <Route index element={user ? <Home /> : <Navigate to="/sign-in" />} />
          <Route
            path="/explore"
            element={user ? <Explore /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/saved"
            element={user ? <Saved /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/all-users"
            element={user ? <AllUsers /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/create-post"
            element={user ? <CreatePost /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/update-post/:id"
            element={user ? <EditPost /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/posts/:id"
            element={user ? <PostDetails /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/profile/:id/*"
            element={user ? <Profile /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/update-profile/:id"
            element={user ? <UpdateProfile /> : <Navigate to="/sign-in" />}
          />
        </Route>
      </Routes>
      {/* Toaster component for displaying notifications */}
      <Toaster />
    </main>
  );
}

export default App;
