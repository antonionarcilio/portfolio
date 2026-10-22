import { notFound } from 'next/navigation';

// Catch-all para qualquer sub-rota não definida dentro de um locale válido.
// Aciona o [locale]/not-found.tsx em vez de cair no 404 padrão do Next.js.
export default function CatchAll() {
  notFound();
}
