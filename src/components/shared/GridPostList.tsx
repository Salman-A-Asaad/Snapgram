// Importing necessary modules, components, and contexts
import { useUserContext } from "@/context/AuthContext"; // Custom hook for accessing user context
import { Models } from "appwrite"; // Models from Appwrite
import { Link } from "react-router-dom"; // Link component from React Router
import PostStats from "./PostStats"; // Component for displaying post statistics

// Define props type for GridPostList component
type GridPostListProps = {
  posts: Models.Document[]; // Array of posts
  showUser?: boolean; // Flag to determine whether to display user information
  showStats?: boolean; // Flag to determine whether to display post statistics
};

// GridPostList component
const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  // Custom hook to access user context
  const { user } = useUserContext();

  return (
    // Container for grid layout
    <ul className="grid-container">
      {/* Mapping through posts array to render each post */}
      {posts.map((post) => {
        return (
          // Individual grid item representing a post
          <li key={post.$id} className="relative min-w-80 h-80">
            {/* Link to the post detail page */}
            <Link to={`/posts/${post.$id}`} className="grid-post_link">
              {/* Image representing the post */}
              <img
                src={post.imageUrl} // URL of the post image
                alt="post" // Alternative text for the image
                className="h-full w-full object-cover" // CSS classes for styling
              />
            </Link>
            {/* Container for user information and post statistics */}
            <div className="grid-post_user">
              {/* Conditional rendering of user information */}
              {showUser && (
                // Container for user avatar and name
                <div className="flex items-center justify-start gap-2">
                  {/* User avatar */}
                  <img
                    src={post.creator.imageUrl} // URL of the user's avatar
                    alt="creator" // Alternative text for the avatar
                    className="h-8 w-8 rounded-full object-cover" // CSS classes for styling
                  />
                  {/* User name */}
                  <p className="line-clamp-1">{post.creator.name}</p>
                </div>
              )}
              {/* Conditional rendering of post statistics */}
              {showStats && <PostStats post={post} userId={user.id} />}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

// Export the GridPostList component as default
export default GridPostList;
