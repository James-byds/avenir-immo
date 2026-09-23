import React from "react";

/**
 * Faq — île React (client:visible), port de components/surfaces/Faq.jsx
 *
 * Accordéon dont les réponses sont TOUJOURS dans le HTML (masquées par
 * max-height), jamais montées au clic — indispensable pour le SEO. L'ancre de
 * l'URL ouvre la bonne réponse au chargement. Émet le JSON-LD FAQPage depuis les
 * mêmes données ; passer `structuredData={false}` s'il est déjà écrit côté page.
 */
export interface FaqItem {
  q: string;
  a: React.ReactNode;
  id?: string;
}
export interface FaqProps {
  items?: FaqItem[];
  openIndex?: number;
  single?: boolean;
  idPrefix?: string;
  structuredData?: boolean;
  className?: string;
}

function slug(s: string): string {
  return String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/** Texte brut d'une réponse JSX — le JSON-LD reprend mot pour mot ce qui est affiché. */
function plainText(node: React.ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (typeof node === "object" && node !== null && "props" in node) {
    return plainText((node as any).props?.children);
  }
  return "";
}

export default function Faq(props: FaqProps) {
  const {
    items = [],
    openIndex = 0,
    single = true,
    idPrefix = "faq",
    structuredData = true,
    className = "",
  } = props;

  const anchor = (i: number) => idPrefix + "-" + (items[i].id || slug(items[i].q));

  const initial = (): number | number[] => {
    let start = openIndex;
    if (typeof window !== "undefined" && window.location.hash) {
      const h = window.location.hash.slice(1);
      const found = items.findIndex((it) => idPrefix + "-" + (it.id || slug(it.q)) === h);
      if (found > -1) start = found;
    }
    return single ? start : start >= 0 ? [start] : [];
  };

  const [open, setOpen] = React.useState<number | number[]>(initial);
  const refs = React.useRef<(HTMLDivElement | null)[]>([]);

  const isOpen = React.useCallback(
    (i: number) => (Array.isArray(open) ? open.includes(i) : open === i),
    [open]
  );

  const measure = React.useCallback(() => {
    refs.current.length = items.length;
    refs.current.forEach((el, i) => {
      if (el) el.style.maxHeight = isOpen(i) ? el.scrollHeight + "px" : "0px";
    });
  }, [isOpen, items.length]);

  React.useLayoutEffect(measure, [measure, items]);

  React.useEffect(() => {
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    refs.current.forEach((el) => {
      if (el) ro.observe(el.firstElementChild || el);
    });
    return () => ro.disconnect();
  }, [measure]);

  function toggle(i: number) {
    if (single) {
      setOpen(open === i ? -1 : i);
    } else {
      setOpen((prev) => {
        const arr = prev as number[];
        return arr.includes(i) ? arr.filter((x) => x !== i) : [...arr, i];
      });
    }
  }

  const ld =
    structuredData && items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: plainText(it.a) },
          })),
        }
      : null;

  return (
    <div className={"faq-list " + className}>
      {items.map((it, i) => (
        <div className={"faq-item" + (isOpen(i) ? " open" : "")} key={it.q} id={anchor(i)}>
          <h3 className="faq-q-h">
            <button
              className="faq-q"
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen(i)}
              aria-controls={anchor(i) + "-a"}
            >
              <span>{it.q}</span>
              <span className="faq-ic" aria-hidden="true" />
            </button>
          </h3>
          <div
            className="faq-a"
            id={anchor(i) + "-a"}
            role="region"
            aria-labelledby={anchor(i)}
            ref={(el) => {
              refs.current[i] = el;
            }}
          >
            <div className="faq-a-inner">{it.a}</div>
          </div>
        </div>
      ))}
      {ld && (
        <script
          type="application/ld+json"
          /* Échappe « < » pour empêcher tout </script> dans une réponse de rompre
             la balise (JSON-LD = données, pas du HTML : pas de sanitizer requis). */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
        />
      )}
    </div>
  );
}
