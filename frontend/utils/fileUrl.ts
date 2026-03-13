/**
 * Helper to resolve the full URL for a Strapi file.
 * Handles both relative paths (prepends VITE_API_URL) and absolute URLs (S3/CDN).
 */
export function resolveStrapiFileUrl(fileUrl?: string | null): string | null {
    if (!fileUrl) return null;

    // Already absolute (e.g. S3, Cloudinary, or external link)
    if (fileUrl.startsWith('http')) {
        return fileUrl;
    }

    // Get base URL from env, ensuring no trailing slash
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:1337').replace(/\/$/, '');

    // Ensure fileUrl starts with a slash if not present (though Strapi usually provides it)
    const cleanPath = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;

    return `${baseUrl}${cleanPath}`;
}
