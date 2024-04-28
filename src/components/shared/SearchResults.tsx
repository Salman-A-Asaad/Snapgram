// Importing necessary components
import Loader from "./Loader"; // Loader component for indicating loading state
import GridPostList from "./GridPostList"; // GridPostList component for displaying a list of posts

// Define props type for SearchResults component
type SearchResultsProps = {
  isSearchFetching: boolean; // Flag indicating whether search is in progress
  searchedPosts: any; // Searched posts data
};

// SearchResults component
const SearchResults = ({
  isSearchFetching, // Flag indicating whether search is in progress
  searchedPosts, // Searched posts data
}: SearchResultsProps) => {
  // Render loader if search is in progress
  if (isSearchFetching) return <Loader />;

  // Render GridPostList if there are search results
  if (
    searchedPosts &&
    searchedPosts?.documents &&
    searchedPosts?.documents.length > 0
  )
    return <GridPostList posts={searchedPosts.documents} />;

  // Render message if there are no search results
  return <p className="text-light-4 mt-10 text-center w-full">No results</p>;
};

// Export the SearchResults component as default
export default SearchResults;
