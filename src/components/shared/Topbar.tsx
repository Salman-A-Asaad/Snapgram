// Importing necessary modules and components
import { Link, useNavigate } from "react-router-dom"; // React Router hooks for navigation
import { Button } from "../ui/button"; // Button component
import { useSignOutAccount } from "@/lib/react-query/quueriesAndMutations"; // Custom hook for signing out user
import { useEffect } from "react"; // React hook for side effects
import { useUserContext } from "@/context/AuthContext"; // Custom hook for accessing user context

// Topbar component
const Topbar = () => {
  // Custom hook for signing out user
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  // React Router hook for navigation
  const navigate = useNavigate();

  // Custom hook for accessing user context
  const { user } = useUserContext();

  // Effect hook to navigate to homepage after successful sign-out
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]); // Dependency array: useEffect will run when isSuccess changes

  // Render the Topbar UI
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        {/* Logo linking to homepage */}
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>
        {/* Buttons for signing out and accessing user profile */}
        <div className="flex gap-4">
          {/* Button for signing out */}
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()} // Click event handler for signing out
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          {/* Link to user profile */}
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || `/assets/icons/profile-placeholder.svg`} // User profile image or placeholder image
              alt="profile-image" // Alternative text for profile image
              className="h-8 w-8 rounded-full" // CSS classes for styling
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Export the Topbar component as default
export default Topbar;
