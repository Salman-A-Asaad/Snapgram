// Importing necessary modules from React and ReactDOM
import React from "react";
import ReactDOM from "react-dom/client";

// Importing the main App component
import App from "./App";

// Importing HashRouter for routing
import { HashRouter } from "react-router-dom";

// Importing AuthProvider for authentication context
import AuthProvider from "./context/AuthContext";

// Importing QueryProvider for managing queries with React Query
import { QueryProvider } from "./lib/react-query/QueryProvider";

// Rendering the application inside a React root
ReactDOM.createRoot(document.getElementById("root")!).render(
  // Strict mode for highlighting potential issues
  <React.StrictMode>
    {/* Using HashRouter for routing */}
    <HashRouter>
      {/* Providing query functionality with QueryProvider */}
      <QueryProvider>
        {/* Providing authentication context with AuthProvider */}
        <AuthProvider>
          {/* Main application component */}
          <App />
        </AuthProvider>
      </QueryProvider>
    </HashRouter>
  </React.StrictMode>
);
