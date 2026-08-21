import Link from 'next/link';

// Landing minima con los demos disponibles. A medida que se agreguen mas
// rubros (peluquerias, etc.) se van sumando aca como links nuevos.
const DEMOS = [
  { href: '/demo/inmobiliaria', label: 'Inmobiliaria' },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Demos de sitios web</h1>
      <p className="mt-2 text-sm text-slate-500">
        Vistas previas para mostrarle a prospectos. Personalizables por query params
        (ej: <code className="rounded bg-slate-100 px-1">?nombre=...&amp;ciudad=...</code>).
      </p>
      <div className="mt-6 flex flex-col gap-3 w-full">
        {DEMOS.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 hover:border-emerald-600 hover:text-emerald-700"
          >
            {d.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
