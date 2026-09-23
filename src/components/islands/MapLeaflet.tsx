import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type * as LeafletNS from "leaflet";

/**
 * MapLeaflet — île React (client:visible). Carte OpenStreetMap pour AgencyCard.
 *
 * ⚠️ 5e île, au-delà du budget documenté (4) : intégration demandée
 * explicitement. Ne s'hydrate que lorsque AgencyCard media="map" reçoit des
 * coordonnées ; sinon la carte agence reste statique (placeholder + .map-pin).
 *
 * Leaflet touche `window` dès l'import du module : on l'importe donc
 * DYNAMIQUEMENT dans l'effet (client uniquement), sinon le pré-rendu SSR de
 * l'île plante (« window is not defined »). Le CSS et les types restent en
 * import statique (sans accès à window).
 *
 * Marqueur aux couleurs de la marque (divIcon reprenant .map-pin : disque vert
 * + halo). Les var(--…) se résolvent depuis :root (DOM global).
 */
export interface MapLeafletProps {
  lat: number;
  lng: number;
  zoom?: number;
  /** Titre du marqueur (popup) */
  label?: string;
}

export default function MapLeaflet({ lat, lng, zoom = 15, label }: MapLeafletProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletNS.Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;

    (async () => {
      const L = (await import("leaflet")).default;
      const el = ref.current;
      if (!el || mapRef.current || cancelled) return;

      const map = L.map(el, {
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([lat, lng], zoom);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const icon = L.divIcon({
        className: "agc-leaflet-pin",
        html:
          '<span style="display:block;width:18px;height:18px;border-radius:50%;' +
          "background:var(--green,#17413B);box-shadow:0 0 0 8px rgba(23,65,59,.18)," +
          '0 0 0 18px rgba(23,65,59,.07)"></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const marker = L.marker([lat, lng], { icon, title: label }).addTo(map);
      if (label) marker.bindPopup(label);

      // Leaflet lit la taille du conteneur au montage : recalcul après layout.
      raf = requestAnimationFrame(() => map.invalidateSize());
    })();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, zoom, label]);

  return (
    <div
      ref={ref}
      className="agc-map"
      aria-label={label ? `Carte — ${label}` : "Carte de l'agence"}
      style={{ width: "100%", aspectRatio: "16 / 8.2", minHeight: "200px" }}
    />
  );
}
