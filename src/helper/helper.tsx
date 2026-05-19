// Helper function to fix Appwrite image URLs
export const getCleanImageUrl = (url: string) => {
  if (!url) return "/assets/icons/profile-placeholder.svg";

  // Only process Appwrite storage URLs
  if (url.includes("cloud.appwrite.io") && url.includes("/preview")) {
    // Step 1: Replace 'preview' with 'view'
    let cleanUrl = url.replace("/preview", "/view");

    // Step 2: Remove all transformation parameters, keep only 'project'
    const baseUrl = cleanUrl.split("?")[0];
    const projectMatch = cleanUrl.match(/project=([^&]+)/);

    if (projectMatch) {
      // Return base URL with only the project parameter
      return `${baseUrl}?project=${projectMatch[1]}`;
    }

    // Return base URL without any parameters
    return baseUrl;
  }

  return url;
};
