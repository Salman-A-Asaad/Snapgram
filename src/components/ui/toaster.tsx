// Import necessary modules and components
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"; // Import toast components
import { useToast } from "@/components/ui/use-toast"; // Import custom hook for managing toast state

// Define Toaster component to render toast notifications
export function Toaster() {
  const { toasts } = useToast(); // Destructure toasts from custom hook

  // Render the toast provider and map through each toast to render individual toast components
  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>} // Render toast title
              if provided
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}{" "}
              // Render toast description if provided
            </div>
            {action} // Render toast action button if provided
            <ToastClose /> // Render toast close button
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
