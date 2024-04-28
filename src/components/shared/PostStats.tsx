// Importing necessary modules, components, and types
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/quueriesAndMutations"; // Custom hooks for interacting with API
import { checkIsLiked } from "@/lib/utils"; // Utility function for checking if a post is liked
import { Models } from "appwrite"; // Models from Appwrite
import { useEffect, useState } from "react"; // Hooks for side effects and state management
import Loader from "./Loader"; // Loader component for indicating loading state

// Define props type for PostStats component
type PostStatsProps = {
  post?: Models.Document; // Post object
  userId: string; // ID of the current user
};

// PostStats component
const PostStats = ({ post, userId }: PostStatsProps) => {
  // Extracting liked users from the post object
  const likedList = post?.likes.map((user: Models.Document) => user.$id);

  // State for storing liked users
  const [likes, setLikes] = useState(likedList);

  // State for tracking if the post is saved
  const [isSaved, setIsSaved] = useState(false);

  // Custom hook for liking a post
  const { mutate: likePost } = useLikePost();

  // Custom hook for saving a post
  const { mutate: savePost, isPending: isSaving } = useSavePost();

  // Custom hook for deleting a saved post
  const { mutate: deleteSavePost, isPending: isDeleting } =
    useDeleteSavedPost();

  // Custom hook for fetching current user data
  const { data: currentUser } = useGetCurrentUser();

  // Finding the saved post record of the current user
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );

  // Effect hook to update isSaved state when currentUser changes
  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  // Function to handle post liking
  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost({ postId: post?.$id!, likesArray: newLikes });
  };

  // Function to handle post saving
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavePost(savedPostRecord.$id);
    } else {
      savePost({ postId: post?.$id!, userId: userId });
      setIsSaved(true);
    }
  };

  // Rendering post statistics
  return (
    <div className="flex justify-between items-center z-20">
      {/* Container for like button and count */}
      <div className="flex gap-2 mr-5">
        {/* Like button */}
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg" // Liked icon if the post is liked
              : "/assets/icons/like.svg" // Like icon if the post is not liked
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost} // Click event handler for liking the post
          className="cursor-pointer" // CSS class for cursor styling
        />
        {/* Like count */}
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      {/* Container for save button */}
      <div className="flex gap-2">
        {/* Render loader if saving or deleting is in progress */}
        {isSaving || isDeleting ? (
          <Loader /> // Loader component
        ) : (
          // Save button
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"} // Saved icon if the post is saved, otherwise Save icon
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost} // Click event handler for saving the post
            className="cursor-pointer" // CSS class for cursor styling
          />
        )}
      </div>
    </div>
  );
};

// Export the PostStats component as default
export default PostStats;
