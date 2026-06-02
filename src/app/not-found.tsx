import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-lg text-gray-600">Página não encontrada.</p>
      <Link href="/" className="text-blue-600 underline">
        Voltar para o início
      </Link>
    </main>
  );
}
