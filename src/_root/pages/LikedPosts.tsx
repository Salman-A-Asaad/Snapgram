// Importing necessary components and hooks
import GridPostList from "@/components/shared/GridPostList"; // Component for displaying posts in a grid layout
import Loader from "@/components/shared/Loader"; // Loader component for displaying loading state
import { useGetCurrentUser } from "@/lib/react-query/quueriesAndMutations"; // Custom hook for fetching current user

// Functional component for displaying liked posts
const LikedPosts = () => {
  // Fetching current user data using useGetCurrentUser hook
  const { data: currentUser } = useGetCurrentUser();

  // Rendering loader if current user data is not available yet
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Rendering the component
  return (
    <>
      {/* Conditional rendering for no liked posts */}
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      {/* Rendering GridPostList component with liked posts */}
      <GridPostList posts={currentUser.liked} showStats={false} />
    </>
  );
};

// Exporting LikedPosts component as default
export default LikedPosts;
