// Importing necessary components from the shared directory
import { Bottombar, LeftSidebar, Topbar } from "@/components/shared";

// Importing Outlet component from react-router-dom for routing
import { Outlet } from "react-router-dom";

// Functional component defining the layout of the application
const RootLayout = () => {
  return (
    // Main container with flex layout for responsiveness
    <div className="w-full md:flex">
      {/* Topbar component for displaying top navigation */}
      <Topbar />

      {/* LeftSidebar component for displaying side navigation */}
      <LeftSidebar />

      {/* Section for rendering the main content of the application */}
      <section className="flex flex-1 h-full">
        {/* Outlet component renders the matched child route */}
        <Outlet />
      </section>

      {/* Bottombar component for displaying bottom navigation */}
      <Bottombar />
    </div>
  );
};

// Exporting RootLayout component as default
export default RootLayout;
