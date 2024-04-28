// Import necessary modules and components
import * as React from "react"; // Import React library
import * as LabelPrimitive from "@radix-ui/react-label"; // Import Radix UI label component
import { cva, type VariantProps } from "class-variance-authority"; // Import class variance authority utility

import { cn } from "@/lib/utils"; // Import utility function for combining class names

// Define labelVariants using class variance authority to define label variants
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

// Define Label component using React.forwardRef to forward the ref to the label element
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>, // Forwarded ref type
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & // Props including variant props
    VariantProps<typeof labelVariants> // Variant props from labelVariants
>(
  // Destructure className and rest props from props
  ({ className, ...props }, ref) => (
    // Render Radix UI label component with specified class names and props
    <LabelPrimitive.Root
      ref={ref} // Forwarded ref
      className={cn(labelVariants(), className)} // Combine default and custom class names
      {...props} // Spread additional props
    />
  )
);
Label.displayName = LabelPrimitive.Root.displayName; // Set display name for the Label component

export { Label }; // Export Label component
