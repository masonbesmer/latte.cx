import { projects } from "../lib/projects";

const STATIC_ROUTES = [
  { path: "/", label: "Home" },
  { path: "/cyberpunk", label: "Cyberpunk" },
  { path: "/cyberpunk/contact", label: "Cyberpunk / Contact" },
  { path: "/destiny", label: "Destiny" },
  { path: "/fallout", label: "Fallout" },
  { path: "/synthwave", label: "Synthwave" },
  { path: "/tron", label: "Tron" },
  { path: "/vinyl", label: "Vinyl" },
];

const PROJECT_ROUTES = projects.map((project) => ({
  path: `/cyberpunk/projects/${project.slug}`,
  label: `Cyberpunk / Projects / ${project.title}`,
}));

const ALL_ROUTES = [...STATIC_ROUTES, ...PROJECT_ROUTES];

export function SecretRoutesNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 max-h-[50vh] overflow-y-auto border-t border-neutral-700 bg-neutral-900/95 backdrop-blur-sm px-4 py-3 text-sm">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
        All routes
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {ALL_ROUTES.map((route) => (
          <li key={route.path}>
            <a
              href={route.path}
              className="text-neutral-300 underline decoration-neutral-600 hover:text-white hover:decoration-neutral-300"
            >
              {route.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
