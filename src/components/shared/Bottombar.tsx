// Importing necessary constants and modules
import { bottombarLinks } from "@/constants"; // Constants for bottom bar links
import { Link, useLocation } from "react-router-dom"; // Link component from React Router and useLocation hook

// Bottombar component
const Bottombar = () => {
  // Get the current pathname using useLocation hook from React Router
  const { pathname } = useLocation();

  return (
    // Bottom bar section
    <section className="bottom-bar">
      {/* Mapping through bottom bar links */}
      {bottombarLinks.map((link) => {
        // Determine if the current link is active based on pathname
        const isActive = pathname == link.route;

        return (
          // Link element for each bottom bar item
          <Link
            to={link.route} // Destination route
            key={link.label} // Unique key for React rendering
            // Dynamic class based on link activity, applying background color if active
            className={`${
              isActive && "bg-primary-500 rounded-[10px]"
            } flex-center flex-col gap-1 p-2 transition`}
          >
            {/* Image icon for the link */}
            <img
              src={link.imgURL} // Image source
              alt={link.label} // Alternative text for accessibility
              width={16} // Width of the image
              height={16} // Height of the image
              // Dynamic class to invert colors if the link is active
              className={`${isActive && "invert-white"}`}
            />
            {/* Label for the link */}
            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

// Export the Bottombar component as default
export default Bottombar;
