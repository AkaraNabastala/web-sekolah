// Domain models: news

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface NewsArticle {
  id: number;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail?: string;
  author: string;
  views_count: number;
  status: 'draft' | 'published';
  published_at: string;
  created_at?: string;
  updated_at?: string;
}
