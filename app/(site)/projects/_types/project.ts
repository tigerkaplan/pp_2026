export type Project = {
  id: number;
  slug: string;
  title: string;
  summary: string;

  featured: boolean;
  year: number;
  role: string;

  stack: string[];
  tags: string[];

  problem: string;
  solution: string;
  result: string;

  features: string[];
  images: string[];

  links: {
    live?: string;
    github?: string;
  };

  seo?: {
    title: string;
    description: string;
    ogImage: string | null;
  };
};
