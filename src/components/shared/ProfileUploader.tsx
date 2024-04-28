// Importing necessary modules and utilities
import { useCallback, useState } from "react"; // React hooks for state and side effects
import { FileWithPath, useDropzone } from "react-dropzone"; // Dropzone component for file uploads

import { convertFileToUrl } from "@/lib/utils"; // Utility function for converting file to URL

// Define props type for ProfileUploader component
type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void; // Callback function to handle file changes
  mediaUrl: string; // URL of the media file
};

// ProfileUploader component
const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
  // State for storing selected file(s)
  const [file, setFile] = useState<File[]>([]);

  // State for storing URL of the selected file
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  // Callback function for handling file drop
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Update state with accepted files
      setFile(acceptedFiles);
      // Invoke callback function to handle file changes
      fieldChange(acceptedFiles);
      // Convert the first accepted file to URL and update state
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [file] // Dependency array
  );

  // Configuration object for the Dropzone component
  const { getRootProps, getInputProps } = useDropzone({
    onDrop, // Callback function for file drop
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"], // Accepted file types
    },
  });

  // Render the Dropzone component
  return (
    <div {...getRootProps()}>
      {/* Input element to trigger file selection */}
      <input {...getInputProps()} className="cursor-pointer" />

      {/* Container for displaying the selected image and change text */}
      <div className="cursor-pointer flex-center gap-4">
        {/* Display the selected image or placeholder image */}
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"} // URL of the image to be displayed
          alt="image" // Alternative text for the image
          className="h-24 w-24 rounded-full object-cover object-top" // CSS classes for styling
        />
        {/* Text to indicate changing profile photo */}
        <p className="text-primary-500 small-regular md:bbase-semibold">
          Change profile photo
        </p>
      </div>
    </div>
  );
};

// Export the ProfileUploader component as default
export default ProfileUploader;
