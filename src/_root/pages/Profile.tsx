// Importing necessary components, hooks, and utilities from React Router, components, and context
import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom"; // Hooks and components for routing
import { LikedPosts } from "@/_root/pages"; // Component for displaying liked posts
import { useUserContext } from "@/context/AuthContext"; // Hook for accessing user context
import Loader from "@/components/shared/Loader"; // Loader component for displaying loading state
import { Button } from "@/components/ui/button"; // Button component for user interactions
import GridPostList from "@/components/shared/GridPostList"; // Component for displaying posts in a grid layout
import {
  useFollowingUser,
  useGetCurrentUser,
  useGetUserById,
  useUnFollowingUser,
} from "@/lib/react-query/quueriesAndMutations.ts"; // Custom hooks for fetching user data and managing follows
import { useEffect, useState } from "react"; // Hooks for managing component lifecycle
import { toast } from "@/components/ui/use-toast"; // Toast component for displaying notifications
import { Loader as ReactLoader } from "lucide-react"; // Loader component from Lucide React library

// Interface for props of StatBlock component
interface StabBlockProps {
  value: string | number;
  label: string;
}

// StatBlock component to display statistics
const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

// Profile component to display user profile details
const Profile = () => {
  // Hooks for accessing route parameters, user context, and current location
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  // Custom hooks for fetching user data and managing follows
  const { data: me } = useGetCurrentUser();
  const { data: currentUser, refetch: refetchUser } = useGetUserById(id || "");
  const { mutateAsync: followingUser, isPending: isLoadingUpdateFollow } =
    useFollowingUser();
  const { mutateAsync: unFollowingUser, isPending: isLoadingUpdateUnFollow } =
    useUnFollowingUser();

  // State to manage follow status
  const [isFollowing, setIsFollowing] = useState<boolean>(
    me?.followers.includes(id)
  );

  // Function to handle follow/unfollow actions
  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFollowing) {
      const follow = await unFollowingUser({
        userId: me?.$id!,
        followingId: id!,
      });
      if (!follow) {
        setIsFollowing(false);
        return toast({
          title: "please try again .",
        });
      }
      setIsFollowing(!isFollowing);
    } else {
      const follow = await followingUser({
        userId: me?.$id!,
        followingId: id!,
      });
      if (!follow) {
        setIsFollowing(false);
        return toast({
          title: "please try again .",
        });
      }
      setIsFollowing(!isFollowing);
    }
  };

  // Effect to refetch user data when follow status changes
  useEffect(() => {
    refetchUser();
  }, [isFollowing, refetchUser]);

  // Conditional rendering while user data is being fetched
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Rendering the component
  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        {/* Profile header */}
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          {/* Profile image */}
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 object-cover rounded-full"
          />
          {/* Profile information */}
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            {/* Profile name and username */}
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>
            {/* Profile statistics */}
            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              {/* Posts count */}
              <StatBlock value={currentUser.posts.length} label="Posts" />
              {/* Followers count */}
              <StatBlock value={currentUser.following} label="Followers" />
              {/* Following count */}
              <StatBlock
                value={currentUser.followers.length}
                label="Following"
              />
            </div>
            {/* Profile bio */}
            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>
          {/* Follow/Edit profile buttons */}
          <div className="flex justify-center gap-4">
            {/* Edit profile button */}
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            {/* Follow/Unfollow button */}
            <div className={`${user.id === id && "hidden"}`}>
              <Button
                onClick={handleFollow}
                type="button"
                className={`${
                  isFollowing ? "shad-button_secoundary" : "shad-button_primary"
                } px-8 ${
                  isLoadingUpdateFollow || isLoadingUpdateUnFollow
                    ? "cursor-none"
                    : ""
                }`}
              >
                {isLoadingUpdateFollow || isLoadingUpdateUnFollow ? (
                  <ReactLoader />
                ) : (
                  ""
                )}
                {isLoadingUpdateFollow || isLoadingUpdateUnFollow
                  ? ""
                  : isFollowing
                  ? "Following"
                  : "Follow"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          {/* Posts tab */}
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          {/* Liked posts tab */}
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      {/* Routes for displaying posts */}
      <Routes>
        {/* Route for displaying user's posts */}
        <Route
          index
          element={<GridPostList posts={currentUser.posts} showUser={false} />}
        />
        {/* Route for displaying liked posts if the user is viewing their own profile */}
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      {/* Outlet for nested routes */}
      <Outlet />
    </div>
  );
};

// Exporting Profile component as default
export default Profile;
