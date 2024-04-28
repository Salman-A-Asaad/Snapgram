// Importing ClassValue type and clsx function from clsx library
import { type ClassValue, clsx } from "clsx";

// Importing twMerge function from tailwind-merge library
import { twMerge } from "tailwind-merge";

// Function to merge multiple class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to convert a File object to a URL
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// Function to format a date string into a human-readable format
export function formatDateString(dateString: string) {
  // Options for date formatting
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Creating a Date object from the provided date string
  const date = new Date(dateString);

  // Formatting the date and time separately
  const formattedDate = date.toLocaleDateString("en-US", options);
  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  // Combining the formatted date and time
  return `${formattedDate} at ${time}`;
}

// Function to format a timestamp into a human-readable format (e.g., "Just now", "5 minutes ago")
export const multiFormatDateString = (timestamp: string = ""): string => {
  // Converting timestamp to seconds
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  // Calculating time difference in various units
  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  // Choosing the appropriate format based on the time difference
  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

// Function to check if a user has liked a post
export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};
