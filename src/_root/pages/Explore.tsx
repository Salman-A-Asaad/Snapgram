// Importing necessary components, hooks, and functions
import GridPostList from "@/components/shared/GridPostList"; // Component for displaying posts in a grid layout
import Loader from "@/components/shared/Loader"; // Loader component for displaying loading state
import SearchResults from "@/components/shared/SearchResults"; // Component for displaying search results
import { Input } from "@/components/ui/input"; // Input component for search input
import useDebounce from "@/hooks/useDebounce"; // Custom hook for debouncing search input
import {
  useGetPosts,
  useSearchPosts,
} from "@/lib/react-query/quueriesAndMutations"; // Custom hooks for fetching posts and searching posts
import { useEffect, useState } from "react"; // React hooks for managing component state
import { useInView } from "react-intersection-observer"; // Hook for detecting when an element enters the viewport

// Functional component for exploring posts
const Explore = () => {
  // Hook for detecting when the component is in view
  const { ref, inView } = useInView();

  // Hook for fetching posts
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  // State for storing search input value
  const [searchValue, setSearchValue] = useState("");

  // Flag to determine whether to show search results
  const shouldShowSearchResults = searchValue !== "";

  // Debounced search input value
  const debounceValue = useDebounce(searchValue, 500);

  // Hook for searching posts based on debounced search input
  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(debounceValue);

  // Effect to fetch more posts when reaching the end of the page
  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [inView, searchValue]);

  // Rendering loader if posts data is not available yet
  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  // Flag to determine whether to show posts
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.every((item) => item?.documents.length === 0);

  // Rendering the component
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        {/* Header for search section */}
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>

        {/* Search input */}
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            value={searchValue}
          />
        </div>
      </div>

      {/* Section for displaying search results or popular posts */}
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">
          {/* Conditional rendering based on search results */}
          {searchedPosts
            ? searchedPosts.total > 0
              ? "Search Results"
              : "No Results"
            : ""}
          {/* Conditional rendering based on search state */}
          {!searchedPosts && !isSearchFetching && "Popular Today"}
        </h3>
      </div>

      {/* Container for displaying posts */}
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {/* Conditional rendering based on search state */}
        {shouldShowSearchResults ? (
          // Render search results if search is active
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          // Render message when no posts are available
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          // Render posts if search is not active
          posts?.pages.map((item, index) => {
            return (
              <GridPostList key={`page-${index}`} posts={item?.documents!} />
            );
          })
        )}
      </div>

      {/* Render loader if there are more posts to fetch */}
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

// Exporting Explore component as default
export default Explore;
