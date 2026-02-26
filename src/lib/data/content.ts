export interface ContentFrontmatter {
  title: string;
  slug: string;
  tags: string[];
  category: string;
  date: string;
  summary: string;
}

export interface ContentModule {
  default: unknown;
  metadata: ContentFrontmatter;
}

// Load all markdown files from src/content/
const modules = import.meta.glob<ContentModule>('/src/content/*.md');

export async function getProject(slug: string): Promise<{ component: unknown; meta: ContentFrontmatter } | null> {
  const path = `/src/content/${slug}.md`;
  const loader = modules[path];
  if (!loader) return null;

  const mod = await loader();
  return {
    component: mod.default,
    meta: mod.metadata,
  };
}

export async function getAllProjects(): Promise<ContentFrontmatter[]> {
  const entries = await Promise.all(
    Object.values(modules).map((loader) => loader().then((m) => m.metadata))
  );
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}
