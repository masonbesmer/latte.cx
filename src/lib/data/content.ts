export interface ProjectMeta {
  title: string;
  slug: string;
  tags: string[];
  category: string;
  date: string;
  summary: string;
}

// Eagerly load all .md files from src/content/
const modules = import.meta.glob('/src/content/*.md');

export async function getProject(
  slug: string
): Promise<{ component: ConstructorOfATypedSvelteComponent; meta: ProjectMeta } | null> {
  const path = `/src/content/${slug}.md`;
  if (!modules[path]) return null;

  const mod = (await modules[path]()) as {
    default: ConstructorOfATypedSvelteComponent;
    metadata: ProjectMeta;
  };

  return { component: mod.default, meta: mod.metadata };
}

export async function getAllProjects(): Promise<ProjectMeta[]> {
  const entries = await Promise.all(
    Object.values(modules).map(async (load) => {
      const mod = (await load()) as { metadata: ProjectMeta };
      return mod.metadata;
    })
  );
  return entries
    .filter(Boolean)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
