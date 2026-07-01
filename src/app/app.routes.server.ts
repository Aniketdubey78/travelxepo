import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'Recent-trend',
    renderMode: RenderMode.SSR
  },
  {
    path: 'feeds',
    renderMode: RenderMode.SSR
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
