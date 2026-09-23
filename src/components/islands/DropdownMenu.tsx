import React, { useState, useRef, useEffect } from "react";

/**
 * DropdownMenu — île React (client:visible), port de components/forms/DropdownMenu.jsx
 *
 * Menu déroulant custom (clavier + focus, fermeture au clic extérieur et à Échap).
 * DERNIER RECOURS : sur une page Astro, préférer le <select> natif (Select.astro)
 * enhancé par ds-script.js. `block` = pleine largeur, style champ (base du Select).
 */
export interface DropdownMenuProps {
  label?: string;
  options?: string[];
  value?: string;
  onSelect?: (option: string) => void;
  defaultOpen?: boolean;
  align?: "left" | "right";
  block?: boolean;
  muted?: boolean;
}

export default function DropdownMenu(props: DropdownMenuProps) {
  const {
    label = "Menu",
    options = [],
    value,
    onSelect,
    defaultOpen = false,
    align = "left",
    block = false,
    muted = false,
  } = props;

  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const pick = (o: string) => {
    setOpen(false);
    onSelect && onSelect(o);
  };

  return (
    <div
      className={
        "dd" +
        (open ? " open" : "") +
        (block ? "" : " dd--inline") +
        (align === "right" ? " dd--right" : "")
      }
      ref={ref}
    >
      <button
        type="button"
        className="dd-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={"dd-val" + (muted ? " is-placeholder" : "")}>{label}</span>
      </button>
      <ul className="dd-menu" role="listbox">
        {options.map((o) => (
          <li
            key={o}
            role="option"
            aria-selected={o === value}
            className={"dd-opt" + (o === value ? " sel" : "")}
            onClick={() => pick(o)}
          >
            {o}
          </li>
        ))}
      </ul>
    </div>
  );
}
