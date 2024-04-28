// Importing necessary components, hooks, and utilities
import Loader from "@/components/shared/Loader"; // Loader component for displaying loading state
import PostStats from "@/components/shared/PostStats"; // Component for displaying post statistics
import { Button } from "@/components/ui/button"; // Button component for user interactions
import { toast } from "@/components/ui/use-toast"; // Toast component for displaying notifications
import { useUserContext } from "@/context/AuthContext"; // Hook for accessing user context
import {
  useDeletePost,
  useGetPostId,
} from "@/lib/react-query/quueriesAndMutations"; // Custom hooks for fetching post by ID and deleting post
import { formatDateString } from "@/lib/utils"; // Utility function for formatting dates
import { Link, useNavigate, useParams } from "react-router-dom"; // Hooks for navigation and accessing route parameters

// Functional component for displaying post details
const PostDetails = () => {
  // Hooks for navigation and accessing route parameters
  const navigate = useNavigate();
  const { id } = useParams();

  // Hook for fetching post data and loading state
  const { data: post, isPending } = useGetPostId(id || "");

  // Hook for accessing user context
  const { user } = useUserContext();

  // Hook for deleting post
  const { mutateAsync: deletePost, isPending: isLoadingDelete } =
    useDeletePost();

  // Function to handle post deletion
  async function handleDeletePost() {
    const deletedPost = await deletePost({
      postId: post?.$id!,
      imageId: post?.imageid,
    });
    console.log(deletedPost?.status);
    if (
      !deletedPost ||
      deletedPost?.status === "Post is saving for some users ."
    ) {
      return toast({
        title: deletedPost?.status + "Can not delete.",
      });
    }
    navigate("/");
  }

  // Rendering the component
  return (
    // Main container for post details
    <div className="post_details-container">
      {/* Conditional rendering based on loading state */}
      {isPending ? (
        // Display loader while post data is loading
        <Loader />
      ) : (
        // Render post details if post data is available
        <div className="post_details-card">
          {/* Post image */}
          <img src={post?.imageUrl} alt="post" className="post_details-img" />
          {/* Post information */}
          <div className="post_details-info">
            {/* Post creator information */}
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                {/* Creator profile image */}
                <img
                  src={
                    post?.creator?.imageUrl ||
                    "assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />

                {/* Creator name, creation date, and location */}
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {formatDateString(post?.$createdAt!)}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              {/* Buttons for editing and deleting post */}
              <div className="flex-center">
                {/* Edit button */}
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
                {/* Delete button */}
                <Button
                  disabled={isLoadingDelete}
                  variant="ghost"
                  className={`ghost_details-delete-btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}
                  onClick={handleDeletePost}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>
            {/* Horizontal line */}
            <hr className="border w-full border-dark-4/80" />
            {/* Post caption and tags */}
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              {/* Post caption */}
              <p>{post?.caption}</p>
              {/* List of post tags */}
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => {
                  return (
                    <li key={tag} className=" text-light-3">
                      #{tag}
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* Post statistics */}
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Exporting PostDetails component as default
export default PostDetails;
