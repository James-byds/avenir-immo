import React, { useState } from "react";

/**
 * ContactForm — île React (client:visible), port de components/forms/ContactForm.jsx
 *
 * Même formulaire en deux tonalités : "light" (carte blanche) ou "ink" (section
 * encre + coordonnées jaunes). Consentement RGPD obligatoire. Le choix de projet
 * est géré en état interne (l'île est autonome) ; `onSubject` reste notifié.
 */
export interface ContactCoordinate {
  label: string;
  value: string;
  href?: string;
}
export interface ContactFormProps {
  tone?: "light" | "ink";
  step?: string;
  title?: string;
  intro?: string;
  subjects?: string[];
  subject?: string;
  onSubject?: (subject: string) => void;
  consentText?: string;
  ctaLabel?: string;
  fineprint?: string;
  splitName?: boolean;
  eyebrow?: string;
  bandTitle?: string;
  bandIntro?: string;
  coordinates?: ContactCoordinate[];
  className?: string;
}

const DEFAULT_SUBJECTS = ["Vendre", "Acheter", "Louer", "Estimer"];

export default function ContactForm(props: ContactFormProps) {
  const {
    tone = "light",
    step = "Écrivez-nous",
    title = "Parlons de votre projet",
    intro = "Réponse sous 24 h ouvrées, par un conseiller de votre commune.",
    subjects = DEFAULT_SUBJECTS,
    subject: subjectProp,
    onSubject,
    consentText = "J'accepte que mes données soient utilisées pour être recontacté. Aucune revente à des tiers.",
    ctaLabel = "Envoyer ma demande",
    fineprint,
    splitName = true,
    eyebrow = "Contact",
    bandTitle = "Une question, un projet ?",
    bandIntro = "Nos agences répondent en moins de 24 h ouvrées.",
    coordinates = [],
    className = "",
  } = props;

  const [subject, setSubject] = useState(subjectProp ?? subjects[0]);
  const pickSubject = (s: string) => {
    setSubject(s);
    onSubject && onSubject(s);
  };

  const fields = (
    <>
      <div className="field">
        <label>Votre projet</label>
        <div className="choice-row">
          {subjects.map((s) => (
            <button
              key={s}
              type="button"
              className={"choice" + (s === subject ? " on" : "")}
              onClick={() => pickSubject(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {splitName ? (
        <div className="field cf-2">
          <div>
            <label>Nom</label>
            <input placeholder="Dupont" />
          </div>
          <div>
            <label>Prénom</label>
            <input placeholder="Marie" />
          </div>
        </div>
      ) : (
        <div className="field cf-2">
          <div>
            <label>Nom &amp; prénom</label>
            <input placeholder="Marie Dupont" />
          </div>
          <div>
            <label>Téléphone</label>
            <input placeholder="+32 4 xx xx xx" />
          </div>
        </div>
      )}
      {splitName && (
        <div className="field">
          <label>Téléphone</label>
          <input placeholder="+32 4 xx xx xx xx" />
        </div>
      )}
      <div className="field">
        <label>E-mail</label>
        <input placeholder="marie.dupont@email.be" />
      </div>
      <div className="field">
        <label>Message</label>
        <textarea placeholder="Décrivez votre projet en quelques lignes…" />
      </div>
      <label className="cf-consent">
        <input type="checkbox" />
        <i />
        <span>{consentText}</span>
      </label>
      <button type="button" className="btn btn--block">
        {ctaLabel} <span className="arr">→</span>
      </button>
      {fineprint && <p className="cf-fine">{fineprint}</p>}
    </>
  );

  const card = (
    <form
      className={"cform" + (tone === "light" ? " " + className : "")}
      onSubmit={(e) => e.preventDefault()}
    >
      {tone === "light" && (
        <>
          <span className="cform-step">{step}</span>
          <h3>{title}</h3>
          {intro && <p className="cf-sub">{intro}</p>}
        </>
      )}
      {fields}
    </form>
  );

  if (tone === "light") return card;

  return (
    <section className={"section contact-band " + className}>
      <div className="wrap">
        <div className="cb-grid">
          <div>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2>{bandTitle}</h2>
            {bandIntro && <p className="cb-lede">{bandIntro}</p>}
            {coordinates.length > 0 && (
              <div className="cb-coord">
                {coordinates.map((c) => (
                  <div key={c.label}>
                    <b>{c.label}</b>
                    {c.href ? <a href={c.href}>{c.value}</a> : c.value}
                  </div>
                ))}
              </div>
            )}
          </div>
          {card}
        </div>
      </div>
    </section>
  );
}
