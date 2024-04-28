// Importing necessary modules, components, hooks, and constants
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"; // Components and hooks from React Router
import { Button } from "../ui/button"; // Button component
import { useSignOutAccount } from "@/lib/react-query/quueriesAndMutations"; // Custom hook for signing out
import { useEffect } from "react"; // Hook for side effects
import { useUserContext } from "@/context/AuthContext"; // Custom hook for accessing user context
import { sidebarLinks } from "@/constants"; // Constants for sidebar links
import { INavLink } from "@/types"; // Interface for navigation links

// LeftSidebar component
const LeftSidebar = () => {
  // Get the current pathname using useLocation hook from React Router
  const { pathname } = useLocation();

  // Custom hook for signing out
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Custom hook for accessing user context
  const { user } = useUserContext();

  // Effect hook to navigate after successful sign out
  useEffect(() => {
    if (isSuccess) navigate(0); // Navigating to the home page after sign out
  }, [isSuccess]); // Dependency array to trigger effect on sign out success

  return (
    // Navigation container for the left sidebar
    <nav className="leftsidebar">
      {/* Container for logo and user profile */}
      <div className="flex flex-col gap-11">
        {/* Link to the home page */}
        <Link to="/" className="flex gap-3 items-center">
          {/* Logo */}
          <img
            src="/assets/images/logo.svg" // Logo image source
            alt="logo" // Alternative text for the logo
            width={170} // Width of the logo
            height={36} // Height of the logo
          />
        </Link>
        {/* Link to user profile */}
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          {/* User profile picture */}
          <img
            src={user.imageUrl || "/assets/images/profile-placeholder.svg"} // User profile image source
            alt="profile" // Alternative text for the profile picture
            className="h-14 w-14 object-cover rounded-full" // CSS classes for styling
          />
          {/* User name and username */}
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p> {/* User name */}
            <p className="small-regular text-light-3">@{user.username}</p>{" "}
            {/* Username */}
          </div>
        </Link>
        {/* Sidebar navigation links */}
        <ul className="flex flex-col gap-6">
          {/* Mapping through sidebar links */}
          {sidebarLinks.map((link: INavLink, index: number) => {
            // Determine if the current link is active based on pathname
            const isActive = pathname == link.route;

            return (
              // List item for each sidebar link
              <li
                key={index} // Unique key for React rendering
                // Dynamic class based on link activity, applying background color if active
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                {/* NavLink for each sidebar link */}
                <NavLink
                  to={link.route} // Destination route
                  className="flex gap-4 items-center p-4" // CSS classes for styling
                >
                  {/* Icon for the link */}
                  <img
                    src={link.imgURL} // Icon image source
                    alt={link.label} // Alternative text for the icon
                    // Dynamic class to invert colors on hover and if the link is active
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label} {/* Label for the link */}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Button for signing out */}
      <Button
        variant="ghost" // Ghost button variant
        className="shad-button_ghost" // CSS classes for styling
        onClick={() => signOut()} // Click event handler for signing out
      >
        <img src="/assets/icons/logout.svg" alt="logout" /> {/* Logout icon */}
        <p className="small-medium lg:base-medium">Logout</p>{" "}
        {/* Logout text */}
      </Button>
    </nav>
  );
};

// Export the LeftSidebar component as default
export default LeftSidebar;
