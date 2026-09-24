import React, { useId, useState } from "react";

/**
 * ContactForm — île React (client:visible), port de components/forms/ContactForm.jsx
 *
 * Même formulaire en deux tonalités : "light" (carte blanche) ou "ink" (section
 * encre + coordonnées jaunes). Consentement RGPD obligatoire. Le choix de projet
 * est géré en état interne (l'île est autonome) ; `onSubject` reste notifié.
 *
 * Validation à la soumission (gabarit 08) : nom, prénom et e-mail requis —
 * classe .err du DS sur les champs fautifs ; le consentement passe par le
 * `required` natif du navigateur. Pas de backend : la demande est journalisée
 * en console.info (TODO endpoint). État envoyé :
 * « ✓ Message envoyé — réponse sous 24 h ».
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
  /** Niveau du titre de carte — 2 quand aucun h2 ne précède le formulaire (page contact). */
  headingLevel?: 2 | 3;
  intro?: string;
  subjects?: string[];
  subject?: string;
  onSubject?: (subject: string) => void;
  consentText?: string;
  /** Lien « confidentialité » du consentement (référence : legale.html) —
      appended « — confidentialité. » quand il est fourni. */
  consentHref?: string;
  consentLinkLabel?: string;
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
    step: stepProp,
    title: titleProp,
    headingLevel = 3,
    intro: introProp,
    subjects = DEFAULT_SUBJECTS,
    subject: subjectProp,
    onSubject,
    consentText = "J'accepte que mes données soient utilisées pour être recontacté. Aucune revente à des tiers.",
    consentHref,
    consentLinkLabel = "confidentialité",
    ctaLabel = "Envoyer ma demande",
    fineprint,
    splitName = true,
    eyebrow = "Contact",
    bandTitle = "Une question, un projet ?",
    bandIntro = "Nos agences répondent en moins de 24 h ouvrées.",
    coordinates = [],
    className = "",
  } = props;

  /* Valeurs par défaut de l'en-tête de carte — ton clair uniquement ; en ton
     encre, l'en-tête ne se rend QUE si la page le demande explicitement (les
     bandes des pages de localité n'en ont pas, cf. maison-a-vendre-liege). */
  const step = stepProp ?? "Écrivez-nous";
  const title = titleProp ?? "Parlons de votre projet";
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const intro = introProp ?? "Réponse sous 24 h ouvrées, par un conseiller de votre commune.";

  const [subject, setSubject] = useState(subjectProp ?? subjects[0]);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  /* Noms accessibles : un id par champ, htmlFor sur chaque label (référence
     contact.html : for="cName"/id="cName"…). */
  const uid = useId();
  const fid = (k: string) => `${uid}${k}`;
  const pickSubject = (s: string) => {
    setSubject(s);
    onSubject && onSubject(s);
  };

  /* Validation à la soumission — mêmes règles que le script inline de la
     référence contact.html (nom rempli, e-mail contenant « @ »), étendues au
     prénom quand le champ existe. Le consentement est bloqué en amont par le
     `required` natif de la case à cocher. */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const bad: Record<string, boolean> = {};
    if (!get("nom")) bad.nom = true;
    if (splitName && !get("prenom")) bad.prenom = true;
    const email = get("email");
    if (!email || email.indexOf("@") < 0) bad.email = true;
    setErrors(bad);
    if (Object.keys(bad).length > 0) return;
    /* TODO endpoint : brancher ici l'envoi réel de la demande (POST vers
       l'API à venir) — aucun backend pour l'instant, on journalise seulement. */
    console.info("[ContactForm] Demande envoyée — aucun backend (TODO endpoint)", {
      sujet: subject,
      nom: get("nom"),
      ...(splitName ? { prenom: get("prenom") } : {}),
      telephone: get("telephone"),
      email,
      message: get("message"),
    });
    setSent(true);
  }

  const fields = (
    <>
      <div className="field">
        <label id={fid("sujet-label")}>Votre projet</label>
        <div className="choice-row" role="group" aria-labelledby={fid("sujet-label")}>
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
            <label htmlFor={fid("nom")}>Nom</label>
            <input id={fid("nom")} name="nom" placeholder="Dupont" autoComplete="family-name" className={errors.nom ? "err" : undefined} />
          </div>
          <div>
            <label htmlFor={fid("prenom")}>Prénom</label>
            <input id={fid("prenom")} name="prenom" placeholder="Marie" autoComplete="given-name" className={errors.prenom ? "err" : undefined} />
          </div>
        </div>
      ) : (
        <div className="field cf-2">
          <div>
            <label htmlFor={fid("nom")}>Nom &amp; prénom</label>
            <input id={fid("nom")} name="nom" placeholder="Marie Dupont" autoComplete="name" className={errors.nom ? "err" : undefined} />
          </div>
          <div>
            <label htmlFor={fid("telephone")}>Téléphone</label>
            <input id={fid("telephone")} name="telephone" placeholder="+32 4 xx xx xx" autoComplete="tel" />
          </div>
        </div>
      )}
      {splitName && (
        <div className="field">
          <label htmlFor={fid("telephone")}>Téléphone</label>
          <input id={fid("telephone")} name="telephone" placeholder="+32 4 xx xx xx xx" autoComplete="tel" />
        </div>
      )}
      <div className="field">
        <label htmlFor={fid("email")}>E-mail</label>
        <input id={fid("email")} name="email" placeholder="marie.dupont@email.be" autoComplete="email" className={errors.email ? "err" : undefined} />
      </div>
      <div className="field">
        <label htmlFor={fid("message")}>Message</label>
        <textarea id={fid("message")} name="message" placeholder="Décrivez votre projet en quelques lignes…" />
      </div>
      <label className="cf-consent">
        <input type="checkbox" name="consent" required />
        <i />
        <span>
          {consentText}
          {consentHref && (
            <>
              {" — "}
              <a href={consentHref}>{consentLinkLabel}</a>.
            </>
          )}
        </span>
      </label>
      <button type="submit" className="btn btn--block">
        {ctaLabel} <span className="arr">→</span>
      </button>
      {fineprint && <p className="cf-fine">{fineprint}</p>}
    </>
  );

  /* État envoyé — vocabulaire .est-done du DS, texte du gabarit 08. */
  const done = (
    <div className="est-done" role="status" aria-live="polite">
      <div className="ed-ic" aria-hidden="true">✓</div>
      <p>{"Message envoyé — réponse sous 24 h"}</p>
    </div>
  );

  const card = (
    <form
      className={"cform" + (tone === "light" ? " " + className : "")}
      onSubmit={handleSubmit}
    >
      {/* En-tête de carte : toujours en ton clair ; en ton encre, seulement à
          la demande explicite de la page (référence equipe-*.html : « Message
          à Olivier Monier » / « Dites-nous l'essentiel. »). */}
      {!sent && tone === "light" && (
        <>
          <span className="cform-step">{step}</span>
          <Heading>{title}</Heading>
          {intro && <p className="cf-sub">{intro}</p>}
        </>
      )}
      {!sent && tone === "ink" && (stepProp || titleProp || introProp) && (
        <>
          {stepProp && <span className="cform-step">{stepProp}</span>}
          {titleProp && <Heading>{titleProp}</Heading>}
          {introProp && <p className="cf-sub">{introProp}</p>}
        </>
      )}
      {sent ? done : fields}
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
