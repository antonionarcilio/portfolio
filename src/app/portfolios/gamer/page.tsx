import { redirect } from 'next/navigation';

/** Redireciona `/portfolios/gamer` para o locale padrão. */
export default function GamerPage() {
  redirect('/portfolios/gamer/pt-BR');
}
