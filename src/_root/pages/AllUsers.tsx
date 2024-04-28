// Importing necessary components and hooks
import Loader from "@/components/shared/Loader"; // Loader component for displaying loading state
import UserCard from "@/components/shared/UserCard"; // UserCard component for displaying user information
import { useToast } from "@/components/ui/use-toast"; // useToast hook for displaying toast messages
import { useUserContext } from "@/context/AuthContext"; // useUserContext hook for accessing user context
import {
  useGetCurrentUser,
  useGetUsers,
} from "@/lib/react-query/quueriesAndMutations.ts"; // Custom hooks for fetching current user and all users

// Functional component to display all users
const AllUsers = () => {
  // Accessing toast function from useToast hook
  const { toast } = useToast();

  // Accessing user data from useUserContext hook
  const { user } = useUserContext();

  // Fetching all users data and loading state using useGetUsers hook
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  // Fetching current user data using useGetCurrentUser hook
  const { data: me } = useGetCurrentUser();

  // Handling error state if there is an error fetching all users data
  if (isErrorCreators) {
    // Displaying error message using toast
    toast({ title: "Something went wrong." });

    // Exiting early if there is an error
    return;
  }

  // Filtering out current user from all users data
  const filterUser = creators?.documents.filter((ele) => ele.$id !== user.id);

  // Rendering the component
  return (
    <div className="common-container">
      <div className="user-container">
        {/* Heading to display on the page */}
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>

        {/* Conditional rendering based on loading state */}
        {isLoading && !creators ? (
          // Displaying Loader component if data is loading
          <Loader />
        ) : (
          // Displaying user grid if data is loaded
          <ul className="user-grid">
            {/* Mapping through filtered users and rendering UserCard component for each user */}
            {filterUser?.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard
                  me={user.id} // Passing current user's ID
                  user={creator} // Passing user object to UserCard component
                  following={me?.followers.includes(creator?.$id)} // Checking if current user follows the displayed user
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Exporting AllUsers component as default
export default AllUsers;
