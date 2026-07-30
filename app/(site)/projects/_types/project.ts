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

  shortTitle?: string;
  status?: string;
  category?: string;
  media: { cover: string | null; coverAlt: string; gallery: string[] };
  caseStudy: {
    overview?: string; context?: string; problem: string; challenge?: string;
    objectives?: string[]; approach?: string[]; solution: string;
    accessibility?: string[]; testing?: string[]; technicalImplementation?: string[];
    result: string; outcomes?: string[]; limitations?: string[]; nextSteps?: string[];
  };
  evidence?: { accessibility: string[]; testing: string[]; integration: string[]; delivery: string[] };
  display: { showLiveLink: boolean; showGithubLink: boolean; showPreview: boolean; showFullProject: boolean };

  seo?: {
    title: string;
    description: string;
    ogImage: string | null;
  };
};
