// Importing necessary modules and components
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Importing form components
import { useToast } from "@/components/ui/use-toast"; // Toast notification hook

import { useUserContext } from "@/context/AuthContext"; // User context hook
import {
  useGetUserById,
  useUpdateUser,
} from "@/lib/react-query/quueriesAndMutations"; // React Query hooks for fetching and updating user data
import Loader from "@/components/shared/Loader"; // Loader component
import { Input } from "@/components/ui/input"; // Input component
import { Textarea } from "@/components/ui/textarea"; // Textarea component
import { Button } from "@/components/ui/button"; // Button component
import { ProfileValidation } from "@/lib/validation"; // Validation schema for profile data
import ProfileUploader from "@/components/shared/ProfileUploader"; // Profile picture uploader component

const UpdateProfile = () => {
  // Importing necessary hooks and context for the component
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();

  // Setting up form handling with Zod schema validation
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });

  // Fetching the current user data by ID
  const { data: currentUser } = useGetUserById(id || "");
  // Hook for updating user information with loading state
  const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
    useUpdateUser();

  // Display loader if the current user data is not available
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Function to handle user profile updates
  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    // Attempt to update the user with the new values
    const updatedUser = await updateUser({
      userId: currentUser.$id,
      name: value.name,
      bio: value.bio,
      file: value.file,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
    });

    // Show a toast message if the update fails
    if (!updatedUser) {
      toast({
        title: `Update user failed. Please try again.`,
      });
    }

    // Update the user context with the new information
    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
    });
    // Navigate to the updated profile page
    return navigate(`/profile/${id}`);
  };

  return (
    // Outer container with flex styling
    <div className="flex flex-1">
      {/* Common container for the form */}
      <div className="common-container">
        {/* Header section with icon and title */}
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        {/* Form component */}
        <Form {...form}>
          {/* Form submission handling */}
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
          >
            {/* Profile picture uploader */}
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    {/* ProfileUploader component for uploading profile picture */}
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    {/* Input field for entering name */}
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username field (disabled) */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    {/* Input field for username (disabled) */}
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email field (disabled) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    {/* Input field for email (disabled) */}
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio field */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    {/* Textarea for entering bio */}
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            {/* Button for updating profile */}
            <div className="flex gap-4 items-center justify-end">
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}
              >
                {/* Display loader if update is in progress */}
                {isLoadingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
