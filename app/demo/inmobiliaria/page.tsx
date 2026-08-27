'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Home,
  Search,
  MapPin,
  Phone,
  Mail,
  Bed,
  Bath,
  Ruler,
  Star,
  Building2,
  ChevronRight,
  Menu,
  X,
  MessageCircle,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Lock,
} from 'lucide-react';

interface Property {
  id: number;
  title: string;
  price: string;
  zone: string;
  beds: number;
  baths: number;
  m2: number;
  imgTag: string;
  lock: number;
  tag: 'Venta' | 'Alquiler';
}

const INITIAL_PROPERTIES: Property[] = [
  { id: 1, title: 'Departamento 2 amb. a estrenar', price: 'USD 89.000', zone: 'Centro', beds: 2, baths: 1, m2: 55, imgTag: 'apartment,interior', lock: 101, tag: 'Venta' },
  { id: 2, title: 'Casa quinta con pileta', price: 'USD 210.000', zone: 'Fisherton', beds: 4, baths: 3, m2: 320, imgTag: 'house,pool', lock: 102, tag: 'Venta' },
  { id: 3, title: 'Monoambiente luminoso', price: '$ 280.000/mes', zone: 'Pichincha', beds: 1, baths: 1, m2: 32, imgTag: 'studio,apartment', lock: 103, tag: 'Alquiler' },
  { id: 4, title: 'PH con patio propio', price: 'USD 76.000', zone: 'Echesortu', beds: 3, baths: 2, m2: 95, imgTag: 'house,patio', lock: 104, tag: 'Venta' },
  { id: 5, title: 'Local comercial sobre avenida', price: '$ 450.000/mes', zone: 'Av. Pellegrini', beds: 0, baths: 1, m2: 60, imgTag: 'storefront,commercial', lock: 105, tag: 'Alquiler' },
  { id: 6, title: 'Departamento 3 amb. con balcón', price: 'USD 125.000', zone: 'Puerto Norte', beds: 3, baths: 2, m2: 78, imgTag: 'apartment,balcony', lock: 106, tag: 'Venta' },
];

const DEMO_PASSWORD = 'admin123';

const STATS = [
  { value: '+150', label: 'propiedades publicadas' },
  { value: '+12', label: 'años en el mercado' },
  { value: '+300', label: 'clientes satisfechos' },
  { value: '4.8', label: 'valoración promedio', icon: true },
];

const SERVICES = [
  { icon: Building2, title: 'Asesoramiento personalizado', desc: 'Te acompañamos en todo el proceso, desde la búsqueda hasta la firma.' },
  { icon: Home, title: 'Tasaciones sin cargo', desc: 'Sabé cuánto vale tu propiedad hoy, sin compromiso.' },
  { icon: Star, title: 'Gestión de créditos', desc: 'Te ayudamos con los trámites de crédito hipotecario paso a paso.' },
];

export default function InmobiliariaDemoPage() {
  return (
    <Suspense fallback={null}>
      <InmobiliariaDemoContent />
    </Suspense>
  );
}

function InmobiliariaDemoContent() {
  const searchParams = useSearchParams();
  const nombre = searchParams.get('nombre') || 'Felipe Propiedades';
  const ciudad = searchParams.get('ciudad') || 'Rosario';
  const telefonoRaw = searchParams.get('telefono') || '5493410000000';
  const [menuOpen, setMenuOpen] = useState(false);
  const [operacion, setOperacion] = useState<'comprar' | 'alquilar'>('comprar');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    price: '',
    zone: '',
    beds: 0,
    baths: 1,
    m2: 50,
    imgTag: 'property',
    tag: 'Venta',
  });

  useEffect(() => {
    const stored = localStorage.getItem('inmobiliaria_props');
    if (stored) {
      try {
        setProperties(JSON.parse(stored));
      } catch {
        // fallback to initial
      }
    }
    const auth = localStorage.getItem('inmobiliaria_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inmobiliaria_props', JSON.stringify(properties));
  }, [properties]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('inmobiliaria_auth', 'true');
      setShowLoginModal(false);
      setLoginPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('inmobiliaria_auth');
    setShowAdminPanel(false);
  };

  const toggleAdminPanel = () => {
    const next = !showAdminPanel;
    setShowAdminPanel(next);
    if (next) {
      setTimeout(() => {
        document.getElementById('admin-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.zone) {
      alert('Completa los campos obligatorios');
      return;
    }
    if (editingId) {
      setProperties(properties.map(p => p.id === editingId ? { ...p, ...formData, id: p.id, lock: p.lock } : p));
      setEditingId(null);
    } else {
      const newId = Math.max(...properties.map(p => p.id), 0) + 1;
      const newLock = Math.max(...properties.map(p => p.lock), 100) + 1;
      setProperties([...properties, { ...formData, id: newId, lock: newLock } as Property]);
    }
    setFormData({
      title: '',
      price: '',
      zone: '',
      beds: 0,
      baths: 1,
      m2: 50,
      imgTag: 'property',
      tag: 'Venta',
    });
  };

  const handleEditProperty = (property: Property) => {
    setFormData(property);
    setEditingId(property.id);
  };

  const handleDeleteProperty = (id: number) => {
    if (confirm('¿Seguro que querés eliminar esta propiedad?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const waLink = `https://wa.me/${telefonoRaw.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hola! Vi la web de ${nombre} y quería consultar por una propiedad.`
  )}`;

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Aviso de que es una demo — se ve solo en pantalla, no molesta el diseño */}
      <div className="bg-amber-400 py-1.5 text-center text-xs font-medium text-amber-950">
        Vista previa de demostración — así podría verse la web de {nombre}
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">{nombre}</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#propiedades" className="hover:text-emerald-700">Propiedades</a>
            <a href="#nosotros" className="hover:text-emerald-700">Nosotros</a>
            <a href="#contacto" className="hover:text-emerald-700">Contacto</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => toggleAdminPanel()}
                  className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Administrar
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Lock className="h-4 w-4" />
                  Admin
                </button>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </>
            )}
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-sm font-medium text-slate-600 md:hidden">
            <a href="#propiedades" onClick={() => setMenuOpen(false)}>Propiedades</a>
            <a href="#nosotros" onClick={() => setMenuOpen(false)}>Nosotros</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
            {isAuthenticated ? (
              <>
                <button onClick={() => { toggleAdminPanel(); setMenuOpen(false); }} className="text-left font-semibold text-blue-600">
                  Administrar
                </button>
                <button onClick={handleLogout} className="text-left font-semibold text-slate-600">
                  Salir
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setShowLoginModal(true); setMenuOpen(false); }} className="text-left font-semibold text-slate-600">
                  Admin
                </button>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-700">
                  Escribir por WhatsApp
                </a>
              </>
            )}
          </div>
        )}
      </header>

      {/* Admin Panel */}
      {showAdminPanel && isAuthenticated && (
        <section id="admin-panel" className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Panel de Administración</h2>
            <p className="mt-2 text-slate-500">Edita, agrega o elimina propiedades.</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleAddProperty} className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              {editingId ? 'Editar propiedad' : 'Agregar nueva propiedad'}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <input
                type="text"
                placeholder="Título"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Precio (ej: USD 100.000 o $ 50.000/mes)"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Zona"
                value={formData.zone || ''}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Dormitorios"
                value={formData.beds || 0}
                onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) || 0 })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Baños"
                value={formData.baths || 1}
                onChange={(e) => setFormData({ ...formData, baths: parseInt(e.target.value) || 1 })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Metros cuadrados"
                value={formData.m2 || 50}
                onChange={(e) => setFormData({ ...formData, m2: parseInt(e.target.value) || 50 })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Tags de imagen (ej: apartment,interior)"
                value={formData.imgTag || ''}
                onChange={(e) => setFormData({ ...formData, imgTag: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <select
                value={formData.tag || 'Venta'}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value as 'Venta' | 'Alquiler' })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option>Venta</option>
                <option>Alquiler</option>
              </select>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
              >
                <Plus className="h-4 w-4" />
                {editingId ? 'Guardar cambios' : 'Agregar propiedad'}
              </button>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: '',
                    price: '',
                    zone: '',
                    beds: 0,
                    baths: 1,
                    m2: 50,
                    imgTag: 'property',
                    tag: 'Venta',
                  });
                }}
                className="mt-3 text-sm font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancelar edición
              </button>
            )}
          </form>

          {/* Tabla de propiedades */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Título</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Precio</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Zona</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Tipo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">{p.title}</td>
                    <td className="px-4 py-3">{p.price}</td>
                    <td className="px-4 py-3">{p.zone}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {p.tag}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProperty(p)}
                          className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(p.id)}
                          className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Hero */}
      <section
        className="relative flex min-h-[520px] items-center bg-slate-900 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(15,23,42,.65), rgba(15,23,42,.65)), url(https://loremflickr.com/1600/900/house,modern?lock=200)` }}
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-20 text-white">
          <p className="mb-3 inline-block rounded-full bg-emerald-700/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Inmobiliaria en {ciudad}
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Encontrá tu próxima propiedad en {ciudad}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">
            Compra, venta y alquiler con el acompañamiento de un equipo con más de 12 años de experiencia en la zona.
          </p>

          {/* Buscador (visual, no funcional) */}
          <div className="mt-8 w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => setOperacion('comprar')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  operacion === 'comprar' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Comprar
              </button>
              <button
                onClick={() => setOperacion('alquilar')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  operacion === 'alquilar' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Alquilar
              </button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5">
                <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Zona o barrio de ${ciudad}...`}
                  className="w-full text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                <Search className="h-4 w-4" />
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-extrabold text-slate-900">
                {s.value}
                {s.icon && <Star className="h-6 w-6 fill-amber-400 text-amber-400" />}
              </div>
              <div className="mt-1 text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Propiedades destacadas */}
      <section id="propiedades" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Propiedades destacadas</h2>
            <p className="mt-2 text-slate-500">Una selección de nuestras publicaciones más recientes.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <div key={p.id} className="group overflow-hidden rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`https://loremflickr.com/600/400/${p.imgTag}?lock=${p.lock}`}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow">
                  {p.tag}
                </span>
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {p.zone}, {ciudad}
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{p.title}</h3>
                <div className="mb-3 text-lg font-bold text-emerald-700">{p.price}</div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  {p.beds > 0 && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5" /> {p.beds}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5" /> {p.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-3.5 w-3.5" /> {p.m2} m²
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900">¿Por qué elegirnos?</h2>
            <p className="mt-2 text-slate-500">Más de una década ayudando a familias de {ciudad} a encontrar su lugar.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-700 py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">¿Querés vender o alquilar tu propiedad?</h2>
          <p className="mt-2 text-emerald-50">Pedí una tasación sin cargo y publicá con nosotros.</p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            <MessageCircle className="h-4 w-4" />
            Escribinos por WhatsApp
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-slate-900">Contacto</h2>
            <p className="mb-6 text-slate-500">Escribinos y te respondemos a la brevedad.</p>
            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-700" />
                Av. Principal 1234, {ciudad}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-700" />
                +{telefonoRaw.replace(/\D/g, '')}
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-700" />
                contacto@{nombre.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-slate-500">Nombre</label>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">Tu nombre</div>
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-slate-500">Mensaje</label>
              <div className="h-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">
                Contanos qué estás buscando...
              </div>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Enviar consulta
            </a>
          </div>
        </div>
      </section>

      {/* Modal de Login */}
      {showLoginModal && !isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Lock className="h-6 w-6 text-slate-900" />
              </div>
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">Panel de Administración</h2>
            <p className="mb-6 text-center text-sm text-slate-600">Ingresa tu contraseña para acceder.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-emerald-700 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800"
              >
                Iniciar sesión
              </button>
            </form>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <p className="mt-4 text-center text-xs text-slate-500">
              (Contraseña de demostración: admin123)
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-900 py-8 text-center text-sm text-slate-400">
        <p>© {new Date().getFullYear()} {nombre}. Todos los derechos reservados.</p>
        <p className="mt-1 text-xs text-slate-500">
          Vista previa de demostración creada por Felipe Settimini — developer web en Rosario
        </p>
      </footer>

      {/* Boton flotante de WhatsApp */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
