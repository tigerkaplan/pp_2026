export type ProjectDisplay = {
  showLiveLink: boolean;
  showGithubLink: boolean;
  showPreview: boolean;
  showFullProject: boolean;
};

export type ProjectContent = {
  id: number;
  slug: string;
  title: string;
  shortTitle?: string;
  featured: boolean;
  status?: string;
  category?: string;
  year: number;
  role: string;
  tags: string[];
  order: number;
  card: {
    summary: string;
    highlights: string[];
  };
  technologies: string[];
  skillIds: string[];
  links: {
    live: string | null;
    github: string | null;
  };
  media: {
    cover: string | null;
    coverAlt: string;
    gallery: string[];
  };
  caseStudy: {
    overview?: string;
    context?: string;
    problem: string;
    challenge?: string;
    objectives?: string[];
    approach?: string[];
    solution: string;
    accessibility?: string[];
    testing?: string[];
    technicalImplementation?: string[];
    result: string;
    outcomes?: string[];
    limitations?: string[];
    nextSteps?: string[];
  };
  evidence?: {
    accessibility: string[];
    testing: string[];
    integration: string[];
    delivery: string[];
  };
  seo?: {
    title: string;
    description: string;
    ogImage: string | null;
  };
  display: ProjectDisplay;
};

export type ProjectRegistration = {
  source: string;
  content: unknown;
};
