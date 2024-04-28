// Importing necessary modules and components
import { useCallback, useState } from "react"; // React hooks for state and callback handling
import { FileWithPath, useDropzone } from "react-dropzone"; // Dropzone hook for file upload functionality
import { Button } from "../ui/button"; // Button component

// Define props type for FileUploader component
type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void; // Callback function to handle file changes
  mediaUrl: string; // Media URL for displaying the current file
};

// FileUploader component
function FileUploader({ fieldChange, mediaUrl }: FileUploaderProps) {
  // State variables to manage uploaded file and its URL
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  // Callback function for when files are dropped or selected
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Update state with accepted files
      setFile(acceptedFiles);
      // Call fieldChange callback to handle file change externally
      fieldChange(acceptedFiles);
      // Set URL for the first accepted file to display preview
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file] // Dependency array for useCallback to track file changes
  );

  // Dropzone hook to enable file drop functionality
  const { getRootProps, getInputProps } = useDropzone({
    onDrop, // Callback function for when files are dropped
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"], // Accepted file types
    },
  });

  return (
    // Wrapper div for dropzone functionality and file preview
    <div
      {...getRootProps()} // Props to apply to the root element of the dropzone
      className="flex flex-center felx-col bg-dark-3 rounded-xl cursor-pointer" // CSS classes for styling
    >
      <input {...getInputProps()} className="cursor-pointer" />{" "}
      {/* Input element for file selection */}
      {/* Conditional rendering based on whether a file is uploaded */}
      {fileUrl ? (
        // Display preview of the uploaded image
        <div className="flex flex-col justify-center items-center pb-6">
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />{" "}
            {/* Image preview */}
          </div>
          <p className="file_uploader-lable">Click or drag photo to replace</p>{" "}
          {/* Instruction for replacing the photo */}
        </div>
      ) : (
        // Display area for dropping or selecting a file
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file-upload"
            width={96}
            height={77}
          />{" "}
          {/* Placeholder icon for file upload */}
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>{" "}
          {/* Instruction for dragging a photo */}
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>{" "}
          {/* Supported file formats */}
          <Button className="shad-button_dark_4">Select</Button>{" "}
          {/* Button for selecting a file */}
        </div>
      )}
    </div>
  );
}

// Export the FileUploader component as default
export default FileUploader;
