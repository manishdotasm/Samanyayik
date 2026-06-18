import { useEffect } from 'react';

/**
 * Custom hook to set the document title for a page.
 * Follows the pattern: "Page Name | Samanyayik"
 * @param pageTitle - The specific page title (e.g., "About Us", "Contact")
 */
export const usePageTitle = (pageTitle: string): void => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${pageTitle} | Samanyayik`;

    // Cleanup: restore previous title on unmount (helpful for SPAs)
    return () => {
      document.title = previousTitle;
    };
  }, [pageTitle]);
};
