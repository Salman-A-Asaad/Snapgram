// Importing necessary modules, components, and types
import { useUserContext } from "@/context/AuthContext"; // Custom hook for accessing user context
import { formatDateString } from "@/lib/utils"; // Utility function for formatting date strings
import { Models } from "appwrite"; // Models from Appwrite
import { Link } from "react-router-dom"; // Link component from React Router
import PostStats from "./PostStats"; // Component for displaying post statistics

// Define props type for PostCard component
type PostCardProps = {
  post: Models.Document; // Post object
};

// PostCard component
const PostCard = ({ post }: PostCardProps) => {
  // Custom hook for accessing user context
  const { user } = useUserContext();

  // Render nothing if the creator of the post is not available
  if (!post.creator) return null;

  return (
    // Container for the post card
    <div className="post-card">
      {/* Container for post header */}
      <div className="flex-between">
        {/* Creator information */}
        <div className="flex items-center gap-3">
          {/* Link to creator profile */}
          <Link to={`/profile/${post.creator.$id}`}>
            {/* Creator profile picture */}
            <img
              src={
                post?.creator?.imageUrl ||
                "assets/icons/profile-placeholder.svg"
              } // Creator profile picture URL
              alt="creator" // Alternative text for the image
              className="rounded-full w-12 h-12 object-cover" // CSS classes for styling
            />
          </Link>
          {/* Container for creator name and post metadata */}
          <div className="flex flex-col">
            {/* Creator name */}
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            {/* Post metadata: creation date and location */}
            <div className="flex-center gap-2 text-light-3">
              {/* Creation date */}
              <p className="subtle-semibold lg:small-regular">
                {formatDateString(post.$createdAt)}{" "}
                {/* Formatted creation date */}
              </p>
              -{/* Location */}
              <p className="subtle-semibold lg:small-regular">
                {post.location} {/* Post location */}
              </p>
            </div>
          </div>
        </div>
        {/* Edit link (visible only to the post creator) */}
        <Link
          to={`/update-post/${post.$id}`} // Destination route for editing the post
          className={`${user.id !== post.creator.$id && "hidden"}`} // Hide edit link if the current user is not the post creator
        >
          {/* Edit icon */}
          <img
            src="/assets/icons/edit.svg" // Edit icon image source
            alt="edit" // Alternative text for the icon
            width={20} // Width of the icon
            height={20} // Height of the icon
          />
        </Link>
      </div>
      {/* Link to view the full post */}
      <Link to={`posts/${post.$id}`}>
        {/* Container for post caption and tags */}
        <div className="small-medium lg:base-medium py-5">
          {/* Post caption */}
          <p>{post.caption}</p>
          {/* List of post tags */}
          <ul className="flex gap-1 mt-2">
            {/* Mapping through post tags */}
            {post.tags.map((tag: string) => {
              return (
                // Tag item
                <li key={tag} className=" text-light-3">
                  #{tag} {/* Tag text */}
                </li>
              );
            })}
          </ul>
        </div>
        {/* Post image */}
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"} // Post image URL
          alt="post image" // Alternative text for the image
          className="post-card_img " // CSS classes for styling
        />
      </Link>
      {/* Component for displaying post statistics */}
      <PostStats post={post} userId={user.id} />
    </div>
  );
};

// Export the PostCard component as default
export default PostCard;
