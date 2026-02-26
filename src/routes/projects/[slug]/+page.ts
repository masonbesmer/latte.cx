import type { PageLoad, EntryGenerator } from './$types';
import { getProject, getAllProjects } from '$lib/data/content';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const entries: EntryGenerator = async () => {
  const all = await getAllProjects();
  return all.map((p) => ({ slug: p.slug }));
};

export const load: PageLoad = async ({ params }) => {
  const result = await getProject(params.slug);

  if (!result) {
    error(404, { message: `// PROJECT NOT FOUND: ${params.slug.toUpperCase()}` });
  }

  return {
    component: result.component,
    meta: result.meta,
  };
};
