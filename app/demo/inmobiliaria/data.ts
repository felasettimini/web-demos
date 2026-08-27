export interface Property {
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
  images?: string[];
  description?: string;
}

// Migra propiedades guardadas con el esquema viejo (una sola `customImage`) al nuevo array `images`.
export function normalizeProperties(raw: unknown[]): Property[] {
  return raw.map((item) => {
    const p = item as Property & { customImage?: string };
    if (p.images) return p as Property;
    const { customImage, ...rest } = p;
    return { ...rest, images: customImage ? [customImage] : [] };
  });
}

export const INITIAL_PROPERTIES: Property[] = [
  { id: 1, title: 'Departamento 2 amb. a estrenar', price: 'USD 89.000', zone: 'Centro', beds: 2, baths: 1, m2: 55, imgTag: 'apartment,interior', lock: 101, tag: 'Venta', description: 'Departamento a estrenar con excelente iluminación natural, cocina integrada y balcón. A pasos de comercios, transporte público y todos los servicios del centro.' },
  { id: 2, title: 'Casa quinta con pileta', price: 'USD 210.000', zone: 'Fisherton', beds: 4, baths: 3, m2: 320, imgTag: 'house,pool', lock: 102, tag: 'Venta', description: 'Amplia casa quinta con parque, pileta y quincho, ideal para disfrutar en familia. Zona residencial tranquila y de fácil acceso.' },
  { id: 3, title: 'Monoambiente luminoso', price: '$ 280.000/mes', zone: 'Pichincha', beds: 1, baths: 1, m2: 32, imgTag: 'studio,apartment', lock: 103, tag: 'Alquiler', description: 'Monoambiente moderno y luminoso, perfecto para una persona o pareja. Ubicado en zona de gran movimiento gastronómico y cultural.' },
  { id: 4, title: 'PH con patio propio', price: 'USD 76.000', zone: 'Echesortu', beds: 3, baths: 2, m2: 95, imgTag: 'house,patio', lock: 104, tag: 'Venta', description: 'PH de tres dormitorios con patio propio, ideal para familias. Barrio tranquilo y arbolado, cerca de escuelas y espacios verdes.' },
  { id: 5, title: 'Local comercial sobre avenida', price: '$ 450.000/mes', zone: 'Av. Pellegrini', beds: 0, baths: 1, m2: 60, imgTag: 'storefront,commercial', lock: 105, tag: 'Alquiler', description: 'Local comercial sobre avenida de alto tránsito peatonal y vehicular. Excelente vidriera y gran visibilidad para cualquier rubro.' },
  { id: 6, title: 'Departamento 3 amb. con balcón', price: 'USD 125.000', zone: 'Puerto Norte', beds: 3, baths: 2, m2: 78, imgTag: 'apartment,balcony', lock: 106, tag: 'Venta', description: 'Departamento de tres ambientes con balcón terraza y vista abierta. Edificio con amenities en una de las zonas más buscadas de la ciudad.' },
];
