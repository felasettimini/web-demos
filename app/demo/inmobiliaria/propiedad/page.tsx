'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Ruler,
  MessageCircle,
  ChevronLeft,
} from 'lucide-react';
import { INITIAL_PROPERTIES, normalizeProperties, type Property } from '../data';

export default function PropiedadDetallePage() {
  return (
    <Suspense fallback={null}>
      <PropiedadDetalleContent />
    </Suspense>
  );
}

function PropiedadDetalleContent() {
  const searchParams = useSearchParams();
  const nombre = searchParams.get('nombre') || 'Felipe Propiedades';
  const ciudad = searchParams.get('ciudad') || 'Rosario';
  const telefonoRaw = searchParams.get('telefono') || '5493410000000';
  const id = Number(searchParams.get('id'));

  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [loaded, setLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('inmobiliaria_props');
    if (stored) {
      try {
        setProperties(normalizeProperties(JSON.parse(stored)));
      } catch {
        // fallback to initial
      }
    }
    setLoaded(true);
  }, []);

  const property = properties.find((p) => p.id === id);
  const images = property?.images && property.images.length > 0
    ? property.images
    : property
      ? [`https://loremflickr.com/1200/700/${property.imgTag}?lock=${property.lock}`]
      : [];
  const backHref = `/demo/inmobiliaria?nombre=${encodeURIComponent(nombre)}&ciudad=${encodeURIComponent(ciudad)}&telefono=${encodeURIComponent(telefonoRaw)}`;
  const waLink = property
    ? `https://wa.me/${telefonoRaw.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hola! Vi la propiedad "${property.title}" en la web de ${nombre} y quería consultar.`
      )}`
    : '#';

  if (loaded && !property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Propiedad no encontrada</h1>
        <p className="text-slate-500">Puede que ya no esté disponible o el enlace sea incorrecto.</p>
        <Link href={backHref} className="flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
          <ChevronLeft className="h-4 w-4" />
          Volver a propiedades
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="bg-amber-400 py-1.5 text-center text-xs font-medium text-amber-950">
        Vista previa de demostración — así podría verse la web de {nombre}
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href={backHref} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">{nombre}</span>
          </Link>
          <Link href={backHref} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700">
            <ChevronLeft className="h-4 w-4" />
            Volver a propiedades
          </Link>
        </div>
      </header>

      {property && (
        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={images[selectedImage] || images[0]}
              alt={property.title}
              className="h-[320px] w-full object-cover sm:h-[420px]"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    idx === selectedImage ? 'border-emerald-700' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${property.title} foto ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {property.tag}
                </span>
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {property.zone}, {ciudad}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{property.title}</h1>
              <div className="mt-3 text-2xl font-bold text-emerald-700">{property.price}</div>

              <div className="mt-6 flex items-center gap-6 border-y border-slate-100 py-4 text-sm text-slate-600">
                {property.beds > 0 && (
                  <span className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-emerald-700" /> {property.beds} dormitorios
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-emerald-700" /> {property.baths} baños
                </span>
                <span className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-emerald-700" /> {property.m2} m²
                </span>
              </div>

              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold text-slate-900">Descripción</h2>
                <p className="whitespace-pre-line text-slate-600">
                  {property.description || 'Esta propiedad todavía no tiene una descripción cargada.'}
                </p>
              </div>
            </div>

            <div className="h-fit rounded-xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-slate-900">¿Te interesa?</h2>
              <p className="mb-4 text-sm text-slate-500">Consultá por esta propiedad sin compromiso.</p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-slate-100 bg-slate-900 py-8 text-center text-sm text-slate-400">
        <p>© {new Date().getFullYear()} {nombre}. Todos los derechos reservados.</p>
        <p className="mt-1 text-xs text-slate-500">
          Vista previa de demostración creada por Felipe Settimini — developer web en Rosario
        </p>
      </footer>
    </div>
  );
}
