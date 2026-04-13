import React from "react";

/**
 * OMW One-Pager
 *
 * Base adapted from the file provided by the user:
 * /Users/blokbergendaniel/Downloads/OMWOnePagerPage.jsx
 *
 * Edit only the CONTENT object below to update copy quickly.
 */

const CONTENT = {
  brand: "OMW",
  title: "OMW - On My Way",
  sublabel: "Covoiturage quotidien en temps réel",
  betaLabel: "Rejoindre la bêta",
  headline: "Transformer les sièges vides en trajets utiles pour tous",
  subheadline:
    "Rendre les trajets domicile-travail en temps réel plus fluides, plus fiables et plus accessibles",
  summary:
    "OMW est un concept de covoiturage en temps réel pour les trajets domicile-travail du quotidien, avec un premier déploiement sur des corridors ciblés à Paris et en Île-de-France.",
  launchTitle: "Démarrage en",
  launchLocation: "Paris / Île-de-France",
  launchBody:
    "Lancement sur des corridors ciblés à Paris et autour de Paris, là où les trajets du quotidien souffrent d'une offre de transport peu fiable, lente ou incomplète.",
  launchBullets: [
    "Perturbations RER et réseau de transport",
    "Liaisons banlieue-banlieue et dernier kilomètre",
    "Validation pilote ciblée",
  ],
  modelTitle: "Modèle économique",
  modelItems: [
    {
      title: "Commission sur les trajets",
      body: "",
      icon: "€",
    },
    {
      title: "Partenariats B2B à venir",
      body: "avec des employeurs, zones d'activité et acteurs de la mobilité",
      icon: "▣",
    },
  ],
  impactTitle: "Impact",
  impactBullets: [
    "Valorisation des places inoccupées",
    "Réduction des émissions liées aux trajets",
    "Moins de capacité automobile gaspillée",
    "Mobilité quotidienne plus efficace",
  ],
  founderName: "Daniel Blokbergen",
  founderRole: "Fondateur",
  cta: "Validation pilote en préparation en Île-de-France",
  contacts: [
    { label: "hello@rideomw.com", icon: "✉", href: "mailto:hello@rideomw.com" },
    { label: "www.rideomw.com", icon: "🌐", href: "https://www.rideomw.com/" },
    {
      label: "rideomw.com/presentation",
      icon: "ⓘ",
      href: "https://www.rideomw.com/presentation",
    },
    {
      label: "linkedin.com/in/danielblokbergen",
      icon: "in",
      href: "https://www.linkedin.com/in/danielblokbergen",
    },
  ],
};

const palette = {
  bg: "#EDEFF5",
  page: "#EEF1F7",
  card: "#F2F4F9",
  text: "#24344A",
  muted: "#7A869A",
  primary: "#204A67",
  line: "#DCE3EF",
  accent: "#8FB6A8",
  accent2: "#B6C8E9",
  pillA: "#1A5FD0",
  pillB: "#0F47A3",
  shadow1: "rgba(255,255,255,0.88)",
  shadow2: "rgba(179,191,211,0.65)",
};

const styles = {
  shell: {
    minHeight: "100vh",
    background: `linear-gradient(180deg, ${palette.bg} 0%, #E8EBF2 100%)`,
    padding: "92px 16px 32px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: palette.text,
    position: "relative",
  },
  betaPill: {
    position: "fixed",
    top: "18px",
    right: "18px",
    zIndex: 20,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "54px",
    padding: "14px 20px",
    borderRadius: "999px",
    border: "1px solid rgba(26,95,208,0.22)",
    background: `linear-gradient(120deg, ${palette.pillA}, ${palette.pillB})`,
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 800,
    lineHeight: 1,
    textDecoration: "none",
    boxShadow: "0 16px 32px rgba(26,95,208,0.28)",
  },
  frame: {
    maxWidth: "1000px",
    margin: "0 auto",
    borderRadius: "40px",
    background: palette.page,
    boxShadow: `
      18px 18px 38px ${palette.shadow2},
      -18px -18px 38px ${palette.shadow1},
      inset 1px 1px 0 rgba(255,255,255,0.45)
    `,
    padding: "34px 34px 40px",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  brandLink: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
    color: "inherit",
    textDecoration: "none",
  },
  logo: {
    fontSize: "32px",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    color: palette.primary,
    lineHeight: 1,
  },
  divider: {
    width: "2px",
    height: "34px",
    background: palette.line,
    borderRadius: "999px",
  },
  titleWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  title: {
    fontSize: "22px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  sublabel: {
    fontSize: "14px",
    color: palette.muted,
  },
  heroTitle: {
    fontSize: "clamp(34px, 5vw, 64px)",
    lineHeight: 1.06,
    letterSpacing: "-0.045em",
    fontWeight: 800,
    maxWidth: "760px",
    margin: "12px 0 14px",
  },
  heroSub: {
    fontSize: "clamp(18px, 2vw, 24px)",
    lineHeight: 1.35,
    color: palette.muted,
    maxWidth: "820px",
    marginBottom: "28px",
  },
  card: {
    background: palette.card,
    borderRadius: "28px",
    boxShadow: `
      12px 12px 26px rgba(183,194,211,0.6),
      -12px -12px 24px rgba(255,255,255,0.82)
    `,
  },
  cardInner: {
    padding: "26px 28px",
  },
  summary: {
    fontSize: "clamp(22px, 2.4vw, 34px)",
    lineHeight: 1.35,
    fontWeight: 500,
    letterSpacing: "-0.025em",
  },
  summaryStrong: {
    fontWeight: 800,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.08fr 0.92fr",
    gap: "20px",
    marginTop: "22px",
    alignItems: "stretch",
  },
  rightCol: {
    display: "grid",
    gap: "20px",
  },
  sectionTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  iconBubble: {
    width: "44px",
    height: "44px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    background: "linear-gradient(145deg, #F7FAFF, #DDE5F0)",
    boxShadow: `
      8px 8px 16px rgba(185,195,210,0.6),
      -8px -8px 16px rgba(255,255,255,0.85)
    `,
    color: palette.accent,
    fontWeight: 800,
    fontSize: "20px",
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: palette.accent,
  },
  launchLocation: {
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    margin: "6px 0 14px",
  },
  body: {
    fontSize: "17px",
    lineHeight: 1.6,
    color: "#5D6981",
  },
  bullets: {
    margin: "20px 0 0",
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: "14px",
  },
  bulletItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "17px",
    color: "#4A566E",
  },
  bulletTick: {
    width: "30px",
    height: "30px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(145deg, #F6FAF7, #DAE8E1)",
    boxShadow: `
      6px 6px 12px rgba(185,195,210,0.48),
      -6px -6px 12px rgba(255,255,255,0.88)
    `,
    color: palette.accent,
    fontWeight: 900,
    fontSize: "16px",
    flexShrink: 0,
  },
  h3: {
    fontSize: "24px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    margin: 0,
  },
  modelStack: {
    display: "grid",
    gap: "14px",
    marginTop: "18px",
  },
  smallCard: {
    borderRadius: "18px",
    padding: "18px 18px",
    background: "#F0F3F8",
    boxShadow: `
      9px 9px 18px rgba(187,197,212,0.55),
      -9px -9px 18px rgba(255,255,255,0.8)
    `,
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  smallIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#7A89A6",
    background: "linear-gradient(145deg, #F7FAFF, #DCE5F0)",
    boxShadow: `
      5px 5px 10px rgba(190,200,215,0.55),
      -5px -5px 10px rgba(255,255,255,0.82)
    `,
    fontWeight: 800,
  },
  smallTitle: {
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1.25,
    marginBottom: "3px",
  },
  smallBody: {
    fontSize: "14px",
    lineHeight: 1.45,
    color: palette.muted,
  },
  founderCard: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  founderPhoto: {
    width: "84px",
    height: "84px",
    borderRadius: "22px",
    background:
      "linear-gradient(145deg, #d9e3f0 0%, #f6f8fc 50%, #cfd8e7 100%)",
    boxShadow: `
      8px 8px 18px rgba(183,194,211,0.52),
      -8px -8px 18px rgba(255,255,255,0.82)
    `,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: palette.primary,
    fontWeight: 800,
  },
  founderName: {
    fontSize: "22px",
    fontWeight: 500,
    letterSpacing: "-0.03em",
  },
  founderRole: {
    fontSize: "18px",
    color: palette.muted,
    marginTop: "6px",
  },
  ctaWrap: {
    marginTop: "22px",
    padding: "24px",
  },
  ctaTitle: {
    fontSize: "clamp(18px, 2vw, 30px)",
    fontWeight: 500,
    letterSpacing: "-0.03em",
    marginBottom: "18px",
  },
  ctaStrong: {
    fontWeight: 800,
  },
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px 20px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#40506A",
    fontSize: "16px",
    lineHeight: 1.3,
    minWidth: 0,
    wordBreak: "break-word",
    textDecoration: "none",
  },
  contactIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(145deg, #F7FAFF, #DBE4F0)",
    boxShadow: `
      5px 5px 10px rgba(186,196,212,0.54),
      -5px -5px 10px rgba(255,255,255,0.85)
    `,
    color: "#7F92B5",
    fontWeight: 800,
    flexShrink: 0,
  },
  responsiveStyle: `
    @media (max-width: 900px) {
      .omw-grid { grid-template-columns: 1fr !important; }
      .omw-contact-grid { grid-template-columns: 1fr !important; }
      .omw-frame { padding: 24px 18px 28px !important; border-radius: 28px !important; }
    }
    @media (max-width: 560px) {
      .omw-shell { padding: 84px 12px 20px !important; }
      .omw-pill {
        top: 12px !important;
        right: 12px !important;
        min-height: 48px !important;
        padding: 12px 16px !important;
        font-size: 13px !important;
      }
      .omw-top-row { gap: 12px !important; }
      .omw-summary { font-size: 18px !important; }
      .omw-logo { font-size: 28px !important; }
      .omw-founder-card { align-items: flex-start !important; }
      .omw-founder-photo { width: 68px !important; height: 68px !important; border-radius: 18px !important; }
    }
    @media print {
      body { background: #ffffff !important; }
      .omw-shell { padding: 0 !important; }
      .omw-pill { display: none !important; }
      .omw-frame {
        box-shadow: none !important;
        border: 1px solid #dfe5ef;
      }
      .omw-card, .omw-small-card {
        box-shadow: none !important;
        border: 1px solid #e2e8f1;
      }
    }
  `,
};

function Card({ children, style, className = "" }) {
  return (
    <div className={`omw-card ${className}`} style={{ ...styles.card, ...style }}>
      <div style={styles.cardInner}>{children}</div>
    </div>
  );
}

function SmallCard({ item }) {
  return (
    <div className="omw-small-card" style={styles.smallCard}>
      <div style={styles.smallIcon}>{item.icon}</div>
      <div>
        <div style={styles.smallTitle}>{item.title}</div>
        {item.body ? <div style={styles.smallBody}>{item.body}</div> : null}
      </div>
    </div>
  );
}

function ContactItem({ contact }) {
  const isExternal = contact.href.startsWith("http");

  return (
    <a
      href={contact.href}
      style={styles.contactItem}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      <span style={styles.contactIcon}>{contact.icon}</span>
      <span>{contact.label}</span>
    </a>
  );
}

export default function OMWOnePagerPage() {
  return (
    <div className="omw-shell" style={styles.shell}>
      <style>{styles.responsiveStyle}</style>

      <a className="omw-pill" href="/" style={styles.betaPill}>
        {CONTENT.betaLabel}
      </a>

      <div className="omw-frame" style={styles.frame}>
        <div className="omw-top-row" style={styles.topRow}>
          <a href="/" style={styles.brandLink} aria-label="Retour à l'accueil OMW">
            <div className="omw-logo" style={styles.logo}>
              {CONTENT.brand}
            </div>
            <div style={styles.divider} />
            <div style={styles.titleWrap}>
              <div style={styles.title}>{CONTENT.title}</div>
              <div style={styles.sublabel}>{CONTENT.sublabel}</div>
            </div>
          </a>
        </div>

        <h1 style={styles.heroTitle}>{CONTENT.headline}</h1>
        <div style={styles.heroSub}>{CONTENT.subheadline}</div>

        <Card>
          <div className="omw-summary" style={styles.summary}>
            <span style={styles.summaryStrong}>OMW est un concept de covoiturage en temps réel</span>{" "}
            pour les trajets domicile-travail du quotidien, avec un premier déploiement
            sur des corridors ciblés à Paris et en Île-de-France.
          </div>
        </Card>

        <div className="omw-grid" style={styles.grid}>
          <Card>
            <div style={styles.sectionTitleRow}>
              <div style={styles.iconBubble}>⌖</div>
              <div style={styles.sectionTitle}>{CONTENT.launchTitle}</div>
            </div>

            <div style={styles.launchLocation}>{CONTENT.launchLocation}</div>
            <div style={styles.body}>{CONTENT.launchBody}</div>

            <ul style={styles.bullets}>
              {CONTENT.launchBullets.map((bullet) => (
                <li key={bullet} style={styles.bulletItem}>
                  <span style={styles.bulletTick}>✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div style={styles.rightCol}>
            <Card>
              <h3 style={styles.h3}>{CONTENT.modelTitle}</h3>
              <div style={styles.modelStack}>
                {CONTENT.modelItems.map((item) => (
                  <SmallCard key={item.title} item={item} />
                ))}
              </div>
            </Card>

            <Card>
              <div style={styles.sectionTitleRow}>
                <div style={{ ...styles.iconBubble, color: "#9BC46B" }}>◔</div>
                <div style={styles.sectionTitle}>{CONTENT.impactTitle}</div>
              </div>

              <ul style={{ ...styles.bullets, marginTop: "10px", gap: "12px" }}>
                {CONTENT.impactBullets.map((bullet) => (
                  <li key={bullet} style={styles.bulletItem}>
                    <span style={{ ...styles.bulletTick, color: "#A8C26D" }}>•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        <div
          className="omw-founder-card omw-card"
          style={{ ...styles.card, marginTop: "20px" }}
        >
          <div style={{ ...styles.cardInner, ...styles.founderCard }}>
            <div className="omw-founder-photo" style={styles.founderPhoto}>
              DB
            </div>
            <div>
              <div style={styles.founderName}>{CONTENT.founderName}</div>
              <div style={styles.founderRole}>{CONTENT.founderRole}</div>
            </div>
          </div>
        </div>

        <Card style={{ marginTop: "22px" }}>
          <div style={styles.ctaWrap}>
            <div style={styles.ctaTitle}>
              <span style={styles.ctaStrong}>Validation pilote</span> en préparation en{" "}
              <span style={styles.ctaStrong}>Île-de-France</span>
            </div>

            <div className="omw-contact-grid" style={styles.contactGrid}>
              {CONTENT.contacts.map((contact) => (
                <ContactItem key={`${contact.icon}-${contact.label}`} contact={contact} />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
