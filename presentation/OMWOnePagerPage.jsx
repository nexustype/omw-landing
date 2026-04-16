import React from "react";
import founderPortrait from "./Portrait 2026.png";
import impactIcon from "./eco_50dp_78A75A_FILL0_wght400_GRAD0_opsz48.svg";
import targetIcon from "./target_50dp_78A75A_FILL0_wght400_GRAD0_opsz48.svg";
import partnerIcon from "./partner_exchange_50dp_255290_FILL0_wght400_GRAD0_opsz48.svg";
import launchIllustration from "./omw-launch-illustration.png";
import logoIcon from "../Icon.png";

const CONTENT = {
  title: "OMW - On My Way",
  sublabel: "Trajets récurrents partagés",
  betaLabel: "Parler du projet",

  headline: "Transformer les sièges vides en trajets utiles.",
  subheadline:
    "Conducteurs et passagers se connectent sur un trajet déjà existant, avec moins de planification.",

  summary:
    "OMW connecte conducteurs et passagers sur un même trajet.",
  summarySupport:
    "Une couche de mobilité qui s’ajoute à la routine, sans détour ou avec +5 min max.",

  launchTitle: "Déploiement ciblé",
  launchLocation: "Paris / Île-de-France",
  launchBody: "Démarrage bêta sur des corridors à fort trafic en IDF.",
  launchBullets: [
    "Trajets récurrents ciblés",
    "Zéro détour ou +5 min max",
    "Pickup de 2 à 10 min à pied",
  ],

  modelTitle: "Modèle économique",
  modelItems: [
    {
      title: "Commission sur les trajets",
      body: "Sur chaque match confirmé.",
      icon: "€",
    },
    {
      title: "Partenariats B2B à venir",
      body: "Employeurs, zones d’activité, mobilité.",
      iconSrc: partnerIcon,
    },
  ],

  impactTitle: "Impact",
  impactBullets: [
    "Sièges vides rendus utiles",
    "Coût voiture mieux amorti",
    "Option voiture plus abordable",
    "Moins de planification",
    "Ajout simple à la routine",
  ],

  founderName: "Daniel Blokbergen",
  founderRole: "Fondateur & Développeur",
  founderFlowTitle: "Flow OMW",
  founderFlowSteps: [
    "Conducteur déjà en route",
    "Point de RDV clair",
    "Passager compatible",
  ],
  founderFlowNote: "Même axe. Peu de coordination. Ride confirmé.",

  footerTitle:
    "Validation pilote en préparation en Île-de-France",
  contacts: [
    {
      label: "hello@rideomw.com",
      icon: "✉",
      href: "mailto:hello@rideomw.com",
    },
    {
      label: "www.rideomw.com",
      icon: "🌐",
      href: "https://www.rideomw.com/",
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
    gap: "22px",
    flexWrap: "wrap",
    marginBottom: "34px",
  },
  brandLink: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
    flexWrap: "wrap",
    color: "inherit",
    textDecoration: "none",
  },
  logo: {
    width: "98px",
    height: "98px",
    flexShrink: 0,
    display: "block",
  },
  divider: {
    width: "3px",
    height: "68px",
    background: palette.line,
    borderRadius: "999px",
  },
  titleWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  title: {
    fontSize: "34px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },
  sublabel: {
    fontSize: "22px",
    color: palette.muted,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: "clamp(34px, 5vw, 56px)",
    lineHeight: 1.04,
    letterSpacing: "-0.045em",
    fontWeight: 800,
    maxWidth: "620px",
    margin: "10px 0 12px",
  },
  heroSub: {
    fontSize: "clamp(17px, 1.9vw, 21px)",
    lineHeight: 1.38,
    color: "#6E7A91",
    maxWidth: "620px",
    marginBottom: "24px",
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
    padding: "24px 26px",
  },
  summary: {
    fontSize: "clamp(20px, 2.1vw, 30px)",
    lineHeight: 1.26,
    fontWeight: 500,
    letterSpacing: "-0.025em",
  },
  summaryStrong: {
    fontWeight: 800,
  },
  summarySupport: {
    display: "block",
    marginTop: "12px",
    fontSize: "clamp(14px, 1.4vw, 16px)",
    lineHeight: 1.45,
    color: "#5D6981",
    letterSpacing: "-0.01em",
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
    width: "56px",
    height: "56px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    background: "linear-gradient(145deg, #F8FBFF, #D9E5F4)",
    boxShadow: `
      10px 10px 18px rgba(185,195,210,0.56),
      -10px -10px 18px rgba(255,255,255,0.9)
    `,
    color: "#6FA490",
    fontWeight: 800,
    fontSize: "24px",
    flexShrink: 0,
  },
  iconImg: {
    width: "30px",
    height: "30px",
    display: "block",
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
    fontSize: "16px",
    lineHeight: 1.52,
    color: "#5D6981",
  },
  launchCardInner: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  launchIllustrationWrap: {
    marginTop: "20px",
    flex: "1 1 240px",
    minHeight: "240px",
    borderRadius: "26px",
    overflow: "hidden",
    background: "linear-gradient(155deg, #DEE5F1, #EEF3FA)",
    boxShadow: `
      inset 1px 1px 0 rgba(255,255,255,0.65),
      10px 10px 18px rgba(186,196,212,0.4),
      -10px -10px 18px rgba(255,255,255,0.75)
    `,
  },
  launchIllustration: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    objectPosition: "center center",
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
    alignItems: "flex-start",
    gap: "12px",
    fontSize: "16px",
    color: "#4A566E",
  },
  bulletTick: {
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(145deg, #F7FBF8, #D8E8E0)",
    boxShadow: `
      7px 7px 14px rgba(185,195,210,0.48),
      -7px -7px 14px rgba(255,255,255,0.9)
    `,
    color: "#76A995",
    fontWeight: 900,
    fontSize: "18px",
    flexShrink: 0,
    marginTop: "1px",
  },
  h3: {
    fontSize: "22px",
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
    gap: "14px",
    alignItems: "flex-start",
  },
  smallIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "999px",
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6889B4",
    background: "linear-gradient(145deg, #F9FBFF, #DCE7F3)",
    boxShadow: `
      7px 7px 13px rgba(190,200,215,0.52),
      -7px -7px 13px rgba(255,255,255,0.88)
    `,
    fontWeight: 800,
    fontSize: "20px",
  },
  smallIconImg: {
    width: "24px",
    height: "24px",
    display: "block",
  },
  smallTitle: {
    fontSize: "15px",
    fontWeight: 700,
    lineHeight: 1.25,
    marginBottom: "3px",
  },
  smallBody: {
    fontSize: "13px",
    lineHeight: 1.4,
    color: palette.muted,
  },
  founderCard: {
    display: "grid",
    gridTemplateColumns: "0.72fr 1.28fr",
    gap: "18px",
    marginTop: "20px",
  },
  founderSubcard: {
    minHeight: "172px",
  },
  founderProfileCard: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  founderMeta: {
    minWidth: "0",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  founderFlow: {
    minWidth: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  founderFlowTitle: {
    margin: "0 0 16px",
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#7A89A6",
  },
  founderFlowRail: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
    alignItems: "start",
    width: "100%",
    maxWidth: "380px",
  },
  founderFlowLine: {
    position: "absolute",
    left: "10%",
    right: "10%",
    top: "22px",
    height: "3px",
    borderRadius: "999px",
    background: "linear-gradient(90deg, rgba(32,74,103,0.14), rgba(26,95,208,0.2), rgba(143,182,168,0.2))",
  },
  founderFlowStep: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    justifyItems: "center",
    gap: "10px",
    textAlign: "center",
  },
  founderFlowDot: {
    width: "46px",
    height: "46px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(145deg, #F9FBFF, #DCE7F3)",
    boxShadow: `
      8px 8px 16px rgba(186,196,212,0.48),
      -8px -8px 16px rgba(255,255,255,0.9)
    `,
    color: "#1A5FD0",
    fontSize: "18px",
    fontWeight: 800,
  },
  founderFlowLabel: {
    fontSize: "13px",
    lineHeight: 1.35,
    color: "#53627D",
    maxWidth: "110px",
  },
  founderFlowNote: {
    margin: "14px 0 0",
    fontSize: "13px",
    lineHeight: 1.4,
    color: "#6D7A90",
    maxWidth: "320px",
  },
  founderPhoto: {
    width: "116px",
    height: "116px",
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: "24px",
    background: "linear-gradient(145deg, #dfe7f2 0%, #f7f9fc 52%, #d2dceb 100%)",
    boxShadow: `
      10px 10px 20px rgba(183,194,211,0.48),
      -10px -10px 20px rgba(255,255,255,0.84),
      inset 1px 1px 0 rgba(255,255,255,0.62)
    `,
  },
  founderPhotoImg: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    objectPosition: "center 24%",
  },
  founderName: {
    fontSize: "28px",
    fontWeight: 700,
    lineHeight: 1.08,
    letterSpacing: "-0.035em",
  },
  founderRole: {
    fontSize: "17px",
    color: "#6D7A90",
    marginTop: "6px",
    fontWeight: 500,
    letterSpacing: "-0.01em",
  },
  ctaWrap: {
    marginTop: "22px",
    padding: "24px 22px",
  },
  ctaTitle: {
    fontSize: "clamp(18px, 1.8vw, 24px)",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    marginBottom: "16px",
    lineHeight: 1.2,
  },
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "1.02fr 0.92fr 1.26fr",
    gap: "12px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#40506A",
    fontSize: "14px",
    lineHeight: 1.3,
    minWidth: 0,
    whiteSpace: "nowrap",
    textDecoration: "none",
  },
  contactIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(145deg, #F9FBFF, #DCE7F3)",
    boxShadow: `
      7px 7px 13px rgba(186,196,212,0.5),
      -7px -7px 13px rgba(255,255,255,0.9)
    `,
    color: "#6889B4",
    fontWeight: 800,
    fontSize: "16px",
    flexShrink: 0,
  },
  responsiveStyle: `
    @media (max-width: 900px) {
      .omw-grid { grid-template-columns: 1fr !important; }
      .omw-founder-grid { grid-template-columns: 1fr !important; }
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
      .omw-brand-link { gap: 14px !important; }
      .omw-summary { font-size: 18px !important; }
      .omw-logo { width: 58px !important; height: 58px !important; }
      .omw-divider { height: 42px !important; width: 2px !important; }
      .omw-title { font-size: 24px !important; }
      .omw-sublabel { font-size: 14px !important; }
      .omw-launch-illustration-wrap {
        min-height: 180px !important;
      }
      .omw-founder-meta {
        width: 100% !important;
      }
      .omw-founder-flow {
        width: 100% !important;
      }
      .omw-founder-flow-rail {
        grid-template-columns: 1fr !important;
        gap: 14px !important;
      }
      .omw-founder-flow-line {
        display: none !important;
      }
      .omw-founder-flow-step {
        justify-items: start !important;
        text-align: left !important;
        grid-template-columns: 46px 1fr !important;
        align-items: center !important;
      }
      .omw-founder-flow-label {
        max-width: none !important;
      }
      .omw-founder-photo {
        width: 90px !important;
        height: 90px !important;
        border-radius: 20px !important;
      }
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

function Card({ children, style, innerStyle, className = "" }) {
  return (
    <div className={`omw-card ${className}`} style={{ ...styles.card, ...style }}>
      <div style={{ ...styles.cardInner, ...innerStyle }}>{children}</div>
    </div>
  );
}

function SmallCard({ item }) {
  return (
    <div className="omw-small-card" style={styles.smallCard}>
      <div style={styles.smallIcon}>
        {item.iconSrc ? <img src={item.iconSrc} alt="" aria-hidden="true" style={styles.smallIconImg} /> : item.icon}
      </div>
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

function FounderFlow() {
  const stepIcons = ["1", "2", "3"];

  return (
    <div className="omw-founder-flow" style={styles.founderFlow}>
      <p style={styles.founderFlowTitle}>{CONTENT.founderFlowTitle}</p>
      <div className="omw-founder-flow-rail" style={styles.founderFlowRail}>
        <div className="omw-founder-flow-line" style={styles.founderFlowLine} />
        {CONTENT.founderFlowSteps.map((step, index) => (
          <div className="omw-founder-flow-step" key={step} style={styles.founderFlowStep}>
            <span style={styles.founderFlowDot}>{stepIcons[index]}</span>
            <span className="omw-founder-flow-label" style={styles.founderFlowLabel}>
              {step}
            </span>
          </div>
        ))}
      </div>
      <p style={styles.founderFlowNote}>{CONTENT.founderFlowNote}</p>
    </div>
  );
}

function IconBubble({ src, children, style, imgStyle }) {
  return (
    <div style={{ ...styles.iconBubble, ...style }}>
      {src ? <img src={src} alt="" aria-hidden="true" style={{ ...styles.iconImg, ...imgStyle }} /> : children}
    </div>
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
          <a className="omw-brand-link" href="/" style={styles.brandLink} aria-label="Retour à l'accueil OMW">
            <img className="omw-logo" src={logoIcon} alt="Logo OMW" style={styles.logo} />
            <div className="omw-divider" style={styles.divider} />
            <div style={styles.titleWrap}>
              <div className="omw-title" style={styles.title}>{CONTENT.title}</div>
              <div className="omw-sublabel" style={styles.sublabel}>{CONTENT.sublabel}</div>
            </div>
          </a>
        </div>

        <h1 style={styles.heroTitle}>{CONTENT.headline}</h1>
        <div style={styles.heroSub}>{CONTENT.subheadline}</div>

        <Card>
          <div className="omw-summary" style={styles.summary}>
            <span style={styles.summaryStrong}>{CONTENT.summary}</span>
            <span style={styles.summarySupport}>{CONTENT.summarySupport}</span>
          </div>
        </Card>

        <div className="omw-grid" style={styles.grid}>
          <Card style={{ height: "100%" }} innerStyle={styles.launchCardInner}>
            <div style={styles.sectionTitleRow}>
              <IconBubble src={targetIcon} />
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

            <div className="omw-launch-illustration-wrap" style={styles.launchIllustrationWrap}>
              <img
                src={launchIllustration}
                alt="Illustration d'un trajet OMW avec point de rendez-vous et véhicule sur un corridor urbain"
                style={styles.launchIllustration}
              />
            </div>
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
                <IconBubble src={impactIcon} imgStyle={{ width: "28px", height: "28px" }} />
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

        <div className="omw-founder-grid" style={styles.founderCard}>
          <Card className="omw-founder-card" style={styles.founderSubcard}>
            <div style={styles.founderProfileCard}>
              <div className="omw-founder-meta" style={styles.founderMeta}>
                <div className="omw-founder-photo" style={styles.founderPhoto}>
                  <img
                    src={founderPortrait}
                    alt="Portrait de Daniel Blokbergen"
                    style={styles.founderPhotoImg}
                  />
                </div>
                <div>
                  <div style={styles.founderName}>{CONTENT.founderName}</div>
                  <div style={styles.founderRole}>{CONTENT.founderRole}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card style={styles.founderSubcard}>
            <FounderFlow />
          </Card>
        </div>

        <Card style={{ marginTop: "22px" }}>
          <div style={styles.ctaWrap}>
            <div style={styles.ctaTitle}>{CONTENT.footerTitle}</div>

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
