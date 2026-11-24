// Decide qué página mostrar en la raíz según el subdominio.
// Hace falta porque Vercel entrega index.html en "/" antes de mirar los
// "rewrites" de vercel.json, así que esos rewrites por subdominio nunca corrían.
// Solo se ejecuta en "/" (ver config.matcher): el resto del sitio no pasa por aquí.

const PAGINA_POR_SUBDOMINIO = {
  'crew.uppipe.co': '/crew',
  'resumen.uppipe.co': '/resumen',
  'summary.uppipe.co': '/summary',
};

export const config = { matcher: '/' };

export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get('host') || url.hostname).toLowerCase();
  const destino = PAGINA_POR_SUBDOMINIO[host];
  if (destino) {
    return new Response(null, {
      headers: { 'x-middleware-rewrite': new URL(destino, url.origin).toString() },
    });
  }
  // Cualquier otro dominio (uppipe.co, www.uppipe.co): sigue normal con la home.
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}
