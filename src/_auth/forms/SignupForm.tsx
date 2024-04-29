// Importing the Zod library for schema definition and validation
import { z } from "zod";

// Importing components from React Router for navigation and linking
import { Link, useNavigate } from "react-router-dom";

// Importing Zod resolver for React Hook Form integration
import { zodResolver } from "@hookform/resolvers/zod";

// Importing useForm hook from React Hook Form for managing form state
import { useForm } from "react-hook-form";

// Importing a custom Button component from the project's UI component library
import { Button } from "@/components/ui/button";

// Importing various form-related components for building forms
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Importing a custom Input component for form inputs
import { Input } from "@/components/ui/input";

// Importing validation schema for signup form
import { SignupValidation } from "@/lib/validation";

// Importing a Loader component that is shared across the application
import Loader from "@/components/shared/Loader";

// Importing a custom hook to display toast notifications
import { useToast } from "@/components/ui/use-toast";

// Importing hooks for creating and signing in user accounts using React Query
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/quueriesAndMutations";

// Importing context hook for accessing user authentication state
import { useUserContext } from "@/context/AuthContext";

// SignupForm component definition
const SignupForm = () => {
  // Hook to display toast notifications
  const { toast } = useToast();
  // Hook to check if the user is authenticated
  const { checkAuthUser } = useUserContext();
  // Hook to navigate programmatically
  const navigate = useNavigate();
  // React Query hooks for creating a user account and checking the creation status
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();
  // React Query hook for signing in a user account
  const { mutateAsync: signInAccount, isPending: isLoadingSginIn } =
    useSignInAccount();
  // useForm hook initialization with Zod schema validation
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    // Attempt to create a new user account with the provided values
    const newUser = await createUserAccount(values);
    // If account creation fails, display a toast notification
    if (!newUser) {
      return toast({ title: "Sign up failed. Please try again. " });
    }
    // Attempt to sign in the newly created account
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    // If sign in fails, display a toast notification
    if (!session) {
      return toast({ title: "Sign in failed. Please try again. " });
    }
    // Check if the user is logged in
    const isLoggedIn = await checkAuthUser();
    // If logged in, reset the form and navigate to the home page
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      // If not logged in, display a toast notification
      return toast({ title: "Sign in failed. Please try again. " });
    }
  }
  // The return statement of the SignupForm functional component
  return (
    // The Form component, spreading the 'form' object props for React Hook Form integration
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        {/* Logo image */}
        <img src="/assets/images/logo.svg" alt="logo" />
        {/* Heading for the signup form */}
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        {/* Subheading with instructions */}
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Snapgram, please enter your details
        </p>

        {/* The form element with an onSubmit event handler */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          {/* FormField for 'name' input */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  {/* Input field for 'name', with styles and field props */}
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                {/* Placeholder for form validation messages */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* FormField for 'username' input */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  {/* Input field for 'username', with styles and field props */}
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* FormField for 'email' input */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  {/* Input field for 'email', with styles and field props */}
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* FormField for 'password' input */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  {/* Input field for 'password', with styles and field props */}
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit button, showing loader if user creation is in progress */}
          <Button
            disabled={isLoadingSginIn || isCreatingUser}
            className="shad-button_primary"
            type="submit"
          >
            {isLoadingSginIn || isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader />
                loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>
          {/* Link to the sign-in page if the user already has an account */}
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              className="text-primary-500 text-small-semibold ml-1"
              to="/sign-in"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
