// Importing Outlet and Navigate components from react-router-dom
import { Outlet, Navigate } from "react-router-dom";

// AuthLayout component definition
const AuthLayout = () => {
  // A boolean to determine if the user is authenticated
  const isAuth = false;

  // The component's return statement
  return (
    // Fragment to group multiple elements without adding extra nodes to the DOM
    <>
      {/* Conditional rendering based on the isAuth value */}
      {isAuth ? (
        // If the user is authenticated, navigate to the home page
        <Navigate to={"/"} />
      ) : (
        // If the user is not authenticated, render the layout for authentication pages
        <>
          {/* Section to hold the authentication form, centered on the page */}
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            {/* Outlet component to render child routes */}
            <Outlet />
          </section>
          {/* Image element for decorative purposes, only visible on large screens */}
          <img
            src="../../public/assets/images/side-img.svg"
            alt="side-img"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
};

// Exporting the AuthLayout component
export default AuthLayout;
