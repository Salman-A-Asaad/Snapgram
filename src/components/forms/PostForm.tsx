// Importing the Zod library for schema validation
import { z } from "zod";
// Importing Zod resolver for React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";
// Importing useForm hook from React Hook Form for managing form state
import { useForm } from "react-hook-form";
// Importing custom Button component
import { Button } from "@/components/ui/button";
// Importing various Form components for building forms
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// Importing custom Input component
import { Input } from "@/components/ui/input";
// Importing custom Textarea component
import { Textarea } from "../ui/textarea";
// Importing FileUploader component for file uploads
import FileUploader from "../shared/FileUploader";
// Importing post validation schema
import { PostValidation } from "@/lib/validation";
// Importing Models from Appwrite SDK for type definitions
import { Models } from "appwrite";
// Importing custom hooks for creating and updating posts
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/quueriesAndMutations";
// Importing context hook to access user context
import { useUserContext } from "@/context/AuthContext";
// Importing custom hook for displaying toast notifications
import { useToast } from "../ui/use-toast";
// Importing useNavigate hook from React Router for navigation
import { useNavigate } from "react-router-dom";

// Defining type for PostFormProps
type PostFormProps = {
  post?: Models.Document; // Optional post document, if editing an existing post
  action: "Create" | "Update"; // Action type to determine form behavior
};

const PostForm = ({ post, action }: PostFormProps) => {
  // Accessing the current user's context
  const { user } = useUserContext();
  // Accessing the toast function for showing notifications
  const { toast } = useToast();
  // Hook for navigating programmatically
  const navigate = useNavigate();

  // Hooks for creating and updating posts, with loading states
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  // Initializing the form with useForm hook using Zod for validation
  const form = useForm<z.infer<typeof PostValidation>>({
    // Resolver for Zod validation schema
    resolver: zodResolver(PostValidation),
    // Default values for the form fields
    defaultValues: {
      caption: post ? post?.caption : "", // Pre-filling the caption if editing
      file: [], // Initial empty array for file uploads
      location: post ? post?.location : "", // Pre-filling the location if editing
      tags: post ? post.tags.join(",") : "", // Converting tags array to string if editing
    },
  });

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    // Check if we are updating an existing post
    if (post && action === "Update") {
      // Attempt to update the post with new values
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id, // Including the post ID for the update
        imageId: post?.imageId, // Including the image ID if present
        imageUrl: post?.imageUrl, // Including the image URL if present
      });
      // If the update fails, show a toast notification
      if (!updatedPost) {
        toast({
          title: "Please try again",
        });
      }
      // Navigate to the updated post's page
      return navigate(`/posts/${post.$id}`);
    }
    // If creating a new post
    const newPost = await createPost({
      ...values,
      userId: user.id, // Including the user ID for the new post
    });
    // If the creation fails, show a toast notification
    if (!newPost) {
      toast({
        title: "Please try again",
      });
    }
    // Navigate to the home page after creating a post
    navigate("/");
  }

  return (
    <Form {...form}>
      {/* Form submission */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        {/* Caption field */}
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form-lable">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        {/* File uploader */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form-lable">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        {/* Location input */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form-lable">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        {/* Tags input */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form-lable">
                Add Tags ( separated by comma " , " )
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Art, Expression, Learn"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        {/* Form submission button */}
        <div className="flex gap-4 items-center justify-end">
          <Button
            disabled={isLoadingCreate || isLoadingUpdate}
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            {isLoadingCreate || isLoadingUpdate
              ? "Loading..."
              : `${action} Post`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
