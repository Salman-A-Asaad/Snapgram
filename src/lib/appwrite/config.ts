// Importing the required environment variables
import.meta.env.VITE_APPWRITE_PROJECT_ID;

// Importing necessary modules from the "appwrite" package
import { Client, Account, Databases, Storage, Avatars } from "appwrite";

// Configuration object for Appwrite
export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
};

// Creating a new instance of the Appwrite client
export const client = new Client();

// Setting the project ID for the client
client.setProject(appwriteConfig.projectId);

// Setting the endpoint URL for the client
client.setEndpoint(appwriteConfig.url);

// Creating instances of Appwrite services using the client
export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
