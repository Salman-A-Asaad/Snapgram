// Import necessary modules and components
import * as React from "react"; // Import React library
import { cn } from "@/lib/utils"; // Import utility function for combining class names

// Define interface for TextareaProps
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// Define Textarea component using React.forwardRef to forward the ref to the textarea element
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  // Destructure className and rest props from props
  ({ className, ...props }, ref) => {
    return (
      // Render textarea element with specified class names and props
      <textarea
        className={cn(
          // Combine default and custom class names for styling
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref} // Forwarded ref
        {...props} // Spread additional props
      />
    );
  }
);
Textarea.displayName = "Textarea"; // Set display name for the Textarea component

export { Textarea }; // Export Textarea component
