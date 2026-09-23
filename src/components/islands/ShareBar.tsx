import React from "react";

/**
 * ShareBar — île React (client:visible), port de components/actions/ShareBar.jsx
 *
 * Barre de partage : presse-papier + état « ✓ Lien copié ». `variant="sticky"`
 * redevient une rangée sous 960 px (géré par site.css).
 */
export type ShareNetwork = "linkedin" | "facebook" | "whatsapp" | "email" | "copy";

export interface ShareBarProps {
  variant?: "row" | "sticky";
  url?: string;
  title?: string;
  networks?: ShareNetwork[];
  label?: string;
  className?: string;
}

const LABELS: Record<string, string> = {
  linkedin: "Partager sur LinkedIn",
  facebook: "Partager sur Facebook",
  whatsapp: "Partager sur WhatsApp",
  email: "Partager par e-mail",
};

function hrefFor(net: string, url: string, title?: string): string {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title || "");
  if (net === "linkedin") return "https://www.linkedin.com/sharing/share-offsite/?url=" + u;
  if (net === "facebook") return "https://www.facebook.com/sharer/sharer.php?u=" + u;
  if (net === "whatsapp") return "https://wa.me/?text=" + t + "%20" + u;
  if (net === "email") return "mailto:?subject=" + t + "&body=" + u;
  return "#";
}

export default function ShareBar(props: ShareBarProps) {
  const {
    variant = "row",
    url = typeof window !== "undefined" ? window.location.href : "",
    title = "",
    networks = ["linkedin", "facebook", "whatsapp", "email", "copy"],
    label = variant === "sticky" ? "Partager" : "Partager cet article",
    className = "",
  } = props;

  const [copied, setCopied] = React.useState(false);

  function copy() {
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className={"sharebar" + (variant === "sticky" ? " sharebar--sticky" : "") + " " + className}>
      {label && <span className="sh-lab">{label}</span>}
      <div className="sh-btns">
        {networks.map((net) =>
          net === "copy" ? (
            <button
              key={net}
              type="button"
              onClick={copy}
              aria-label="Copier le lien"
              title={copied ? "Lien copié" : "Copier le lien"}
            >
              <span className="sh-ico sh-copy" />
            </button>
          ) : (
            <a
              key={net}
              href={hrefFor(net, url, title)}
              aria-label={LABELS[net]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={"sh-ico sh-" + net} />
            </a>
          )
        )}
      </div>
      {copied && <span className="sh-done">✓ Lien copié</span>}
    </div>
  );
}
