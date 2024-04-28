// Importing necessary components and hooks
import PostForm from "@/components/forms/PostForm"; // PostForm component for editing posts
import Loader from "@/components/shared/Loader"; // Loader component for displaying loading state
import { useGetPostId } from "@/lib/react-query/quueriesAndMutations"; // Custom hook for fetching post by ID
import { useParams } from "react-router-dom"; // useParams hook for accessing route parameters

// Functional component for editing a post
const EditPost = () => {
  // Extracting post ID from route parameters
  const { id } = useParams();

  // Fetching post data and loading state using useGetPostId hook
  const { data: post, isPending } = useGetPostId(id || "");

  // Rendering Loader component while data is loading
  if (isPending) return <Loader />;

  // Rendering the component once data is loaded
  return (
    // Main container with flex layout
    <div className="flex flex-1">
      {/* Container for the edit post form */}
      <div className="common-container">
        {/* Container for the header of the edit post section */}
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          {/* Icon for the edit post section */}
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          {/* Title for the edit post section */}
          <h2 className="j3-bold md:h2-bold text-left w-full">Edit post</h2>
        </div>
        {/* Render the PostForm component with action set to "Update" and post data */}
        <PostForm action={"Update"} post={post} />
      </div>
    </div>
  );
};

// Exporting EditPost component as default
export default EditPost;
