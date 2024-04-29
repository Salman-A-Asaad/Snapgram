// Importing necessary libraries and components
import { z } from "zod"; // Zod for schema validation
import { Link, useNavigate } from "react-router-dom"; // React Router for navigation and linking
import { zodResolver } from "@hookform/resolvers/zod"; // Zod resolver for React Hook Form
import { useForm } from "react-hook-form"; // React Hook Form for form handling
import { Button } from "@/components/ui/button"; // Custom button component
// Importing form-related components for UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Custom input component
import { SigninValidation } from "@/lib/validation"; // Sign-in validation schema
import Loader from "@/components/shared/Loader"; // Loader component for loading state
import { useToast } from "@/components/ui/use-toast"; // Toast for notifications
import { useSignInAccount } from "@/lib/react-query/quueriesAndMutations"; // Custom hook for sign-in mutation
import { useUserContext } from "@/context/AuthContext"; // Context for user authentication

// SigninForm component for the sign-in process
const SigninForm = () => {
  // Hooks for toast notifications and user context
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  // Navigation hook for redirecting users
  const navigate = useNavigate();
  // Mutation hook for signing in the account
  const { mutateAsync: signInAccount, isPending: isLoadingSginIn } =
    useSignInAccount();
  // Form hook initialization with Zod validation schema
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    // Attempt to sign in with provided credentials
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    // If sign-in fails, display a toast notification
    if (!session) {
      return toast({ title: "Sign in failed. Please try again." });
    }
    // Check if the user is logged in
    const isLoggedIn = await checkAuthUser();
    // If logged in, reset the form and navigate to the home page
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      // If not logged in, display a toast notification
      return toast({ title: "Sign in failed. Please try again." });
    }
  }

  // JSX for rendering the sign-in form
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        {/* Logo image */}
        <img src="/assets/images/logo.svg" alt="logo" />
        {/* Heading for the sign-in form */}
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        {/* Subheading with instructions */}
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! please enter your details
        </p>

        {/* Form element with onSubmit handler */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          {/* Form field for email input */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Form field for password input */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit button with loading state */}
          <Button
            disabled={isLoadingSginIn || isUserLoading}
            className="shad-button_primary"
            type="submit"
          >
            {isLoadingSginIn || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader />
                loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          {/* Link to the sign-up page */}
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              className="text-primary-500 text-small-semibold ml-1"
              to="/sign-up"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

// Exporting the SigninForm component
export default SigninForm;
