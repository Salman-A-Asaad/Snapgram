// Import necessary modules and types
import { ID, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, database, storage } from "./config";

// Function to create a new user account
export async function createUserAccount(user: INewUser) {
  try {
    // Create a new account with provided user data
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    // Throw error if account creation fails
    if (!newAccount) throw Error;

    // Generate avatar URL
    const avatarUrl = avatars.getInitials(user.name);

    // Save user details to the database
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    // Throw error if saving user to the database fails
    if (!newUser) throw Error;

    return newAccount;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// Function to save user details to the database
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    // Save user details to the database
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// Function to sign in to the account
export async function signInAccount(user: { email: string; password: string }) {
  try {
    // Create a new session with provided email and password
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

// Function to get the current user's account details
export async function getCurrentUser() {
  try {
    // Get current account details
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    // Get current user's details from the database
    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    // Throw error if user details retrieval fails
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

// Function to sign out from the account
export async function signOutAccount() {
  try {
    // Delete current session
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

// Function to create a new post
export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageid: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    // Throw error if post creation fails
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// Function to upload a file to appwrite storage
export async function uploadFile(file: File) {
  try {
    // Create a new file in appwrite storage with a unique ID
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// Function to get a preview URL for a file stored in appwrite storage
export function getFilePreview(fileId: string) {
  try {
    // Get file preview URL from appwrite storage
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    // Throw error if file URL is not available
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// Function to delete a file from appwrite storage
export async function deleteFile(fileId: string) {
  try {
    // Delete file from appwrite storage using its ID
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// Function to get recent posts from the database
export async function getRecentPosts() {
  const posts = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!posts) throw Error;
  return posts;
}

// Function to update the likes array of a post
export async function likePost(postId: string, likesArray: string[]) {
  try {
    // Update the likes array of the post in the database
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// Function to save a post to the user's saved collection
export async function savePost(postId: string, userId: string) {
  try {
    // Create a document in the saves collection with user and post IDs
    const updatedPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// Function to delete a saved post from the user's saved collection
export async function deleteSavedPost(savedRecordId: string) {
  try {
    // Delete the document from the saves collection using its ID
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// Function to get a post by its ID
export async function getPostById(postId: string) {
  try {
    // Get the document from the post collection using its ID
    const post = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return post;
  } catch (error) {
    console.log(error);
  }
}

// Function to update a post
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    // Upload file to appwrite storage if there's a file to update
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get file URL
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Update the post document in the database
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageid: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// Function to delete a post
export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    // Delete the post document from the post collection
    const deletedPost = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    if (!deletedPost) throw Error;

    // Delete the associated image file from appwrite storage
    const deleteImagePost = await deleteFile(imageId);
    if (!deleteImagePost) throw Error;

    // Delete the user's saved record for this post
    const deletedUserPost = await deleteUserPost(postId);
    if (!deletedUserPost) throw Error;

    return {
      status: "ok",
    };
  } catch (error: any) {
    console.log(error.message as string);
    if (error.message === "Server Error")
      return { status: "Post is saving for some users ." };
  }
}

// Function to delete a user's saved post record by postId
export async function deleteUserPost(postId: string) {
  try {
    // Find the user's saved post record in the saves collection
    const deletedUserPostID = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal("post", [postId])]
    );

    // If no saved post record is found, return success status
    if (!deletedUserPostID.total) return { state: 200 };

    // Delete the user's saved post record
    const deletedUserPost = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      deletedUserPostID.documents[0].$id
    );

    // Check if the deletion was successful
    if (!deletedUserPost) throw Error;

    return { state: 200 };
  } catch (error) {
    console.log(error);
  }
}

// Function to get a paginated list of posts with infinite scrolling
export async function getInfinitePosts({
  pageParam = "",
}: {
  pageParam: string;
}) {
  // Define queries for fetching posts with pagination
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    // Retrieve the list of posts from the database based on the queries
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    // Check if posts are retrieved successfully
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

// Function to search posts by caption
export async function searchPosts(searchTerm: string) {
  try {
    // Search for posts containing the given searchTerm in their captions
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    // Check if posts are retrieved successfully
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

// Function to get a list of users
export async function getUsers(limit?: number) {
  // Define queries for fetching users with optional limit
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    // Retrieve the list of users from the database based on the queries
    const users = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    // Check if users are retrieved successfully
    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// Function to get a user by their userId
export async function getUserById(userId: string) {
  try {
    // Retrieve the user document from the database based on the userId
    const user = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    // Check if the user is retrieved successfully
    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

// Function to follow another user
export async function followingUser(userId: string, followingId: string) {
  try {
    // Retrieve the user to be followed
    const followingUser = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      followingId
    );

    // Throw an error if the user to be followed does not exist
    if (!followingUser) throw Error;

    // Increment the following count of the user being followed
    const user = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      followingId,
      {
        following: followingUser.following + 1,
      }
    );

    // Throw an error if the update operation fails
    if (!user) throw Error;

    // Retrieve the current user
    const me = await getCurrentUser();

    // Throw an error if the current user does not exist
    if (!me) throw Error;

    // Get the list of followers of the current user
    const followers: string[] = me?.followers;

    // If the user being followed is not already in the followers list, add them
    if (!followers.includes(followingId)) {
      followers.push(followingId);

      // Update the followers list of the current user
      const me = await database.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId,
        {
          followers: followers,
        }
      );

      // Throw an error if the update operation fails
      if (!me) throw Error;
    }

    return followingId;
  } catch (error) {
    console.log(error);
  }
}

// Function to unfollow another user
export async function unFollowingUser(userId: string, followingId: string) {
  try {
    // Retrieve the user being unfollowed
    const followingUser = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      followingId
    );

    // Throw an error if the user being unfollowed does not exist
    if (!followingUser) throw Error;

    // Decrement the following count of the user being unfollowed
    const user = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      followingId,
      {
        following: followingUser.following - 1,
      }
    );

    // Throw an error if the update operation fails
    if (!user) throw Error;

    // Retrieve the current user
    const me = await getCurrentUser();

    // Throw an error if the current user does not exist
    if (!me) throw Error;

    // Get the list of followers of the current user
    const followers: string[] = me?.followers;

    // If the user being unfollowed is in the followers list, remove them
    if (followers.includes(followingId)) {
      const updateFollowers = followers.filter(
        (ele: string) => ele !== followingId
      );

      // Update the followers list of the current user
      const me = await database.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId,
        {
          followers: updateFollowers,
        }
      );

      // Throw an error if the update operation fails
      if (!me) throw Error;
    }

    return followingId;
  } catch (error) {
    console.log(error);
  }
}

// Function to update user information
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    // If there is a file to update
    if (hasFileToUpdate) {
      // Upload the new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get the new file URL
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Update user information
    const updatedUser = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageid: image.imageId,
      }
    );

    // If the update operation fails
    if (!updatedUser) {
      // Delete the new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file is uploaded, just throw an error
      throw Error;
    }

    // Safely delete the old file after a successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}
