// Importing necessary components, hooks, and models
import GridPostList from "@/components/shared/GridPostList"; // Component for displaying posts in a grid layout
import Loader from "@/components/shared/Loader"; // Loader component for displaying loading state
import { useGetCurrentUser } from "@/lib/react-query/quueriesAndMutations"; // Custom hook for fetching current user data
import { Models } from "appwrite"; // Models from Appwrite for data types

// Saved component to display saved posts of the current user
const Saved = () => {
  // Custom hook to get the current user data
  const { data: currentUser } = useGetCurrentUser();

  // Transforming saved posts to include user's image URL and reversing the order
  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.imageUrl,
      },
    }))
    .reverse();

  // Rendering the component
  return (
    <div className="saved-container">
      {/* Header for saved posts */}
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {/* Conditional rendering based on current user data */}
      {!currentUser ? ( // If user data is not available, display loader
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? ( // If there are no saved posts, display message
            <p className="text-light-4">No available posts</p>
          ) : (
            // If there are saved posts, display them using GridPostList component
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

// Exporting Saved component as default
export default Saved;
