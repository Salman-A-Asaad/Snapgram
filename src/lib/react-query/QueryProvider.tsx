// Importing necessary modules from the "@tanstack/react-query" package and React
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Creating a new instance of QueryClient
const queryClient = new QueryClient();

// Component to provide the QueryClient to the React tree
export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    // Providing the QueryClient to the React tree using QueryClientProvider
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
