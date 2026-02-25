import { getProject } from '$lib/data/content';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const result = await getProject(params.slug);
  if (!result) {
    throw error(404, `Project not found: ${params.slug}`);
  }
  return result;
};
