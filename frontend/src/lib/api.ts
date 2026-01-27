// API Service for fetching data from backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// Project type from backend
export interface BackendProject {
    _id: string;
    title: string;
    slug: string;
    description: string;
    projectMarkdown?: string;
    tags: string[];
    liveUrl?: string;
    githubUrl?: string;
    images?: Array<{ url: string; caption?: string; showOnProject?: boolean }>;
    active?: boolean;
    featured: boolean;
    priority?: number;
    createdAt: string;
    updatedAt: string;
}

// Blog type from backend
export interface BackendBlog {
    _id: string;
    title: string;
    slug: string;
    description: string;
    tags: string[];
    link?: string;
    image?: string;
    active?: boolean;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

// Certification type from backend
export interface BackendCertification {
    _id: string;
    title: string;
    slug: string;
    description: string;
    tags: string[];
    link?: string;
    image?: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    pdf?: string;
    active?: boolean;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

// API Response type
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Fetch all projects
export async function fetchProjects(): Promise<BackendProject[]> {
    try {
        const res = await fetch(`${API_URL}/api/projects`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.error('Failed to fetch projects:', res.status);
            return [];
        }

        const json: ApiResponse<BackendProject[]> = await res.json();
        return json.data || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// Fetch single project by slug
export async function fetchProjectBySlug(slug: string): Promise<BackendProject | null> {
    try {
        const res = await fetch(`${API_URL}/api/projects/${slug}`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.error('Failed to fetch project:', res.status);
            return null;
        }

        const json: ApiResponse<BackendProject> = await res.json();
        return json.data || null;
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}

// Fetch all blogs
export async function fetchBlogs(): Promise<BackendBlog[]> {
    try {
        const res = await fetch(`${API_URL}/api/blogs`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.error('Failed to fetch blogs:', res.status);
            return [];
        }

        const json: ApiResponse<BackendBlog[]> = await res.json();
        return json.data || [];
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return [];
    }
}

// Fetch all certifications
export async function fetchCertifications(): Promise<BackendCertification[]> {
    try {
        const res = await fetch(`${API_URL}/api/certifications`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.error('Failed to fetch certifications:', res.status);
            return [];
        }

        const json: ApiResponse<BackendCertification[]> = await res.json();
        return json.data || [];
    } catch (error) {
        console.error('Error fetching certifications:', error);
        return [];
    }
}
