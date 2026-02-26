import type { PageLoad } from './$types';
import { getProject } from '$lib/data/content';
import { error } from '@sveltejs/kit';

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
