// Import necessary modules and components
import * as React from "react"; // Import React library
import { Slot } from "@radix-ui/react-slot"; // Import Slot component from Radix UI
import { cva, type VariantProps } from "class-variance-authority"; // Import class variance authority for handling button variants

import { cn } from "@/lib/utils"; // Import utility function for combining class names

// Define button variants using class variance authority
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90", // Default button style
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90", // Destructive button style
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Outline button style
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80", // Secondary button style
        ghost: "hover:bg-accent hover:text-accent-foreground", // Ghost button style
        link: "text-primary underline-offset-4 hover:underline", // Link button style
      },
      size: {
        default: "h-10 px-4 py-2", // Default button size
        sm: "h-9 rounded-md px-3", // Small button size
        lg: "h-11 rounded-md px-8", // Large button size
        icon: "h-10 w-10", // Icon button size
      },
    },
    defaultVariants: {
      variant: "default", // Default button variant
      size: "default", // Default button size
    },
  }
);

// Define props for Button component
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean; // Flag indicating if the button should be rendered as a child element
}

// Button component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  // Forwarding ref to Button component
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Determine the component type based on the value of 'asChild'
    const Comp = asChild ? Slot : "button";
    return (
      // Render the component with appropriate class names and props
      <Comp
        className={cn(buttonVariants({ variant, size, className }))} // Combine class names for styling
        ref={ref} // Forwarded ref
        {...props} // Spread additional props
      />
    );
  }
);

// Set display name for Button component
Button.displayName = "Button";

// Export Button component and buttonVariants for use in other components
export { Button, buttonVariants };
