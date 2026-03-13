/// <reference types="vite/client" />


// =======================================
// API BASE URL
// =======================================
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

/**
 * Helper to build query string
 * @param params Object of key-value pairs
 * @returns Query string
 */
export function buildQuery(params: Record<string, any> = {}): string {
    return Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
}

/**
 * Helper to make GET requests to API endpoints
 * @param path The path of the API endpoint (e.g. '/news')
 * @param urlParamsObject URL parameters object, will be stringified
 * @param options Options passed to fetch
 * @returns Parsed JSON response
 */
export async function fetchAPI<T>(
    path: string,
    urlParamsObject: Record<string, any> = {},
    options: RequestInit = {}
): Promise<T> {
    // Merge default and user options
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (options.body instanceof FormData) {
        // Let browser set Content-Type with boundary for FormData
        delete (headers as any)['Content-Type'];
    }

    const mergedOptions = {
        ...options,
        headers,
    };

    // Build request URL
    const queryString = buildQuery(urlParamsObject);
    const requestUrl = `${API_URL}${path}${queryString ? `?${queryString}` : ''}`;

    try {
        const response = await fetch(requestUrl, mergedOptions);
        if (!response.ok) {
            throw new Error(`An error occurred while fetching the data: ${response.statusText}`);
        }
        const data = await response.json();
        return data; // Strapi returns { data: [...], meta: {...} }
    } catch (error) {
        console.error(`Error fetching data from ${path}:`, error);
        throw error;
    }
}

/**
 * Render Strapi Blocks to HTML string
 */
export function renderStrapiBlocks(blocks: any[]): string {
    if (!Array.isArray(blocks)) return '';

    const renderChildren = (children: any[]) => {
        return children.map((child: any) => {
            let text = child.text || '';

            // Handle specialized inline types if present (like link)
            if (child.type === 'link') {
                return `<a href="${child.url}" class="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">${renderChildren(child.children)}</a>`;
            }

            if (!text && !child.children) return '';

            // If it's a wrapper node (like link or list-item might be in some versions), recurse
            if (!text && child.children) return renderChildren(child.children);

            if (child.bold) text = `<strong>${text}</strong>`;
            if (child.italic) text = `<em>${text}</em>`;
            if (child.underline) text = `<u>${text}</u>`;
            if (child.strikethrough) text = `<del>${text}</del>`;
            if (child.code) text = `<code>${text}</code>`;

            return text;
        }).join('');
    };

    return blocks.map((block: any) => {
        switch (block.type) {
            case 'paragraph':
                return `<p class="mb-4 text-black font-sans font-normal leading-relaxed">${renderChildren(block.children)}</p>`;
            case 'heading':
                const Level = `h${block.level || 2}`;
                // Tailwind classes for headings
                const classes = block.level === 1 ? "text-3xl font-serif font-bold mb-4 mt-6"
                    : block.level === 2 ? "text-2xl font-serif font-bold mb-3 mt-5"
                        : "text-xl font-serif font-bold mb-2 mt-4";
                return `<${Level} class="${classes}">${renderChildren(block.children)}</${Level}>`;
            case 'list':
                const tag = block.format === 'ordered' ? 'ol' : 'ul';
                const listClass = block.format === 'ordered' ? 'list-decimal pl-6 mb-4 space-y-2' : 'list-disc pl-6 mb-4 space-y-2';
                return `<${tag} class="${listClass}">
                    ${block.children.map((item: any) => `<li>${renderChildren(item.children)}</li>`).join('')}
                </${tag}>`;
            case 'quote':
                return `<blockquote class="border-l-4 border-secondary pl-4 italic my-6 text-gray-700 font-serif">${renderChildren(block.children)}</blockquote>`;
            case 'image':
                // Strapi image block usually has an image object
                const imgUrl = block.image?.url || '';
                const altText = block.image?.alternativeText || '';
                if (!imgUrl) return '';
                return `<figure class="my-8"><img src="${imgUrl}" alt="${altText}" class="rounded-lg shadow-sm w-full h-auto" /><figcaption class="text-center text-sm text-gray-500 mt-2">${block.image?.caption || ''}</figcaption></figure>`;
            default:
                // Fallback for unknown blocks, just render text
                return renderChildren(block.children || []);
        }
    }).join('');
}

/**
 * Helper to extract text from Strapi Rich Text Block
 * (kept for backward compatibility with excerpts)
 */
export function extractTextFromBlocks(blocks: any[]): string {
    if (!Array.isArray(blocks)) return '';
    return blocks.map(block => {
        if (block.type === 'paragraph' || block.type === 'heading') {
            return block.children?.map((child: any) => child.text).join('') || '';
        }
        return '';
    }).join('\n\n');
}

// Helper to handle the response format if needed (though the provided format is flat in data)
export function flattenStrapiResponse<T>(res: any): T[] {
    if (res?.data && Array.isArray(res.data)) {
        return res.data;
    }
    return [];
}
