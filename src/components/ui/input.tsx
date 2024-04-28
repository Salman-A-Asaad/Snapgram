// Import necessary modules and components
import * as React from "react"; // Import React library

import { cn } from "@/lib/utils"; // Import utility function for combining class names

// Define InputProps interface extending React's input element attributes
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// Define Input component using React.forwardRef to forward the ref to the input element
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  // Destructure className, type, and rest props from InputProps
  ({ className, type, ...props }, ref) => {
    return (
      // Render input element with specified type and class names
      <input
        type={type} // Input type
        className={cn(
          // Combine default and custom class names for styling
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className // Custom class name(s)
        )}
        ref={ref} // Forwarded ref
        {...props} // Spread additional props
      />
    );
  }
);
Input.displayName = "Input"; // Set display name for the Input component

export { Input }; // Export Input component
