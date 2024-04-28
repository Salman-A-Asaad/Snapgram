// Importing necessary components, hooks, and types
import Loader from "@/components/shared/Loader"; // Loader component for displaying loading state
import PostCard from "@/components/shared/PostCard"; // PostCard component for displaying post cards
import { useGetRecentPosts } from "@/lib/react-query/quueriesAndMutations"; // Custom hook for fetching recent posts
import { Models } from "appwrite"; // Types for Appwrite models

// Functional component for the home page
const Home = () => {
  // Fetching recent posts and loading state using useGetRecentPosts hook
  const { data: posts, isPending: isPostLoading } = useGetRecentPosts();

  // Rendering the component
  return (
    // Main container with flex layout
    <div className="flex flex-1">
      {/* Container for the home page */}
      <div className="home-container">
        {/* Container for displaying posts */}
        <div className="home-posts">
          {/* Title for the home feed */}
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

          {/* Conditional rendering based on loading state */}
          {isPostLoading && !posts ? (
            // Display loader if posts are loading
            <Loader />
          ) : (
            // Display post cards if posts are loaded
            <ul className="flex flex-col gap-9 w-full">
              {/* Mapping through posts and rendering PostCard component for each post */}
              {posts?.documents.map((post: Models.Document, index: number) => {
                // Render PostCard component for each post
                return (
                  <li key={index}>
                    <PostCard post={post} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// Exporting Home component as default
export default Home;
