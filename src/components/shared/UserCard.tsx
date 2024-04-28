// Importing necessary modules and components
import { Models } from "appwrite"; // Models from appwrite for TypeScript typings
import { Link } from "react-router-dom"; // React Router component for navigation
import { Button } from "../ui/button"; // Button component
import {
  useFollowingUser,
  useUnFollowingUser,
} from "@/lib/react-query/quueriesAndMutations"; // Custom hooks for following and unfollowing users
import { toast } from "../ui/use-toast"; // Toast component for displaying notifications
import { useState } from "react"; // React hook for managing state
import { Loader } from "lucide-react"; // Loader component for indicating loading state

// Define props type for UserCard component
type UserCardProps = {
  me: string; // Current user ID
  user: Models.Document; // User data
  following: boolean; // Flag indicating whether the current user is following this user
};

// UserCard component
const UserCard = ({ me, user, following }: UserCardProps) => {
  // State for tracking whether the current user is following this user
  const [isFollowing, setIsFollowing] = useState<boolean>(following);

  // Custom hooks for following and unfollowing users
  const { mutateAsync: followingUser, isPending: isLoadingUpdateFollow } =
    useFollowingUser();
  const { mutateAsync: unFollowingUser, isPending: isLoadingUpdateUnFollow } =
    useUnFollowingUser();

  // Function to handle follow/unfollow action
  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFollowing) {
      // If already following, unfollow the user
      const follow = await unFollowingUser({
        userId: me,
        followingId: user.$id,
      });
      if (!follow) {
        // If unfollow operation fails, set isFollowing to false and display error toast
        setIsFollowing(false);
        return toast({
          title: "please try again .",
        });
      }
      setIsFollowing(!isFollowing); // Toggle isFollowing state
    } else {
      // If not following, follow the user
      const follow = await followingUser({
        userId: me,
        followingId: user.$id,
      });
      if (!follow) {
        // If follow operation fails, set isFollowing to false and display error toast
        setIsFollowing(false);
        return toast({
          title: "please try again .",
        });
      }
      setIsFollowing(!isFollowing); // Toggle isFollowing state
    }
  };

  // Render the UserCard UI
  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      {/* User profile image */}
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} // User profile image URL or placeholder image
        alt="creator" // Alternative text for the image
        className="rounded-full w-14 h-14 object-cover" // CSS classes for styling
      />

      <div className="flex-center flex-col gap-1">
        {/* User name */}
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        {/* User username */}
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      {/* Button for follow/unfollow action */}
      <Button
        onClick={handleFollow} // Click event handler for follow/unfollow action
        type="button" // Button type
        size="sm" // Button size
        className={`${
          isFollowing ? "shad-button_secoundary" : "shad-button_primary"
        } px-5 ${
          isLoadingUpdateFollow || isLoadingUpdateUnFollow ? "cursor-none" : ""
        }`} // CSS classes for styling
      >
        {/* Loader component to indicate loading state */}
        {isLoadingUpdateFollow || isLoadingUpdateUnFollow ? <Loader /> : ""}
        {/* Conditional rendering of follow/unfollow text based on loading state and isFollowing state */}
        {isLoadingUpdateFollow || isLoadingUpdateUnFollow
          ? ""
          : isFollowing
          ? "Following"
          : "Follow"}
      </Button>
    </Link>
  );
};

// Export the UserCard component as default
export default UserCard;
