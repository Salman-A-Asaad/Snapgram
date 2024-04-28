// Importing necessary components
import PostForm from "@/components/forms/PostForm"; // PostForm component for creating posts

// Functional component for creating a new post
const CreatePost = () => {
  return (
    // Main container with flex layout
    <div className="flex flex-1">
      {/* Container for the create post form */}
      <div className="common-container">
        {/* Container for the header of the create post section */}
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          {/* Icon for the create post section */}
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          {/* Title for the create post section */}
          <h2 className="j3-bold md:h2-bold text-left w-full">Create post</h2>
        </div>
        {/* Render the PostForm component with action set to "Create" */}
        <PostForm action="Create" />
      </div>
    </div>
  );
};

// Exporting CreatePost component as default
export default CreatePost;
