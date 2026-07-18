"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  Banknote,
  BatteryCharging,
  Building2,
  Check,
  ChevronRight,
  CircleCheck,
  Factory,
  FileCheck2,
  Gauge,
  HandCoins,
  Headphones,
  Home,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Sun,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";

const SolarOrbit = dynamic(() => import("./solar-orbit"), {
  ssr: false,
  loading: () => <div className="orbit-loader" aria-hidden="true" />,
});

const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Products", "/products"],
  ["Process", "/process"],
  ["Finance", "/finance"],
  ["Why us", "/why-us"],
  ["Contact", "/contact"],
] as const;

export type SitePage =
  | "home"
  | "about"
  | "services"
  | "products"
  | "process"
  | "finance"
  | "why-us"
  | "contact";

const pageIntros: Record<Exclude<SitePage, "home">, { index: string; title: string; accent: string; text: string }> = {
  about: {
    index: "01",
    title: "Rooted in experience.",
    accent: "Driven by purpose.",
    text: "Meet the team and mission making dependable solar simpler across Konkan and western Maharashtra.",
  },
  services: {
    index: "02",
    title: "Solar solutions.",
    accent: "Designed around you.",
    text: "Residential, commercial and industrial expertise—from first assessment to lifelong performance.",
  },
  products: {
    index: "03",
    title: "Technology selected.",
    accent: "For lasting trust.",
    text: "Reliable inverters, batteries and compliant solar products from brands known for dependable support.",
  },
  process: {
    index: "04",
    title: "Clear at every step.",
    accent: "Simple from day one.",
    text: "A transparent five-stage installation journey, with documentation and net metering handled for you.",
  },
  finance: {
    index: "05",
    title: "Make the switch.",
    accent: "Without the stress.",
    text: "Guidance for PM Surya Ghar subsidy and flexible finance options for eligible customers.",
  },
  "why-us": {
    index: "06",
    title: "Experience matters.",
    accent: "Support matters more.",
    text: "Power-sector knowledge, proven installations and service that continues after your system goes live.",
  },
  contact: {
    index: "07",
    title: "Your solar journey.",
    accent: "Starts right here.",
    text: "Tell us about your roof and electricity bill. We’ll help you take the next clear step.",
  },
};

const services = [
  {
    icon: Home,
    number: "01",
    title: "Residential Solar",
    text: "Rooftop systems shaped around your home, your roof and your family’s power needs.",
    accent: "lime",
  },
  {
    icon: Building2,
    number: "02",
    title: "Commercial Solar",
    text: "Clean, dependable power for shops, offices and commercial establishments.",
    accent: "blue",
  },
  {
    icon: Factory,
    number: "03",
    title: "Industrial Solar",
    text: "Durable, higher-capacity systems engineered for long-term operational savings.",
    accent: "orange",
  },
  {
    icon: Wrench,
    number: "04",
    title: "Maintenance & Repair",
    text: "Responsive upkeep that keeps every solar system performing at its best.",
    accent: "violet",
  },
  {
    icon: FileCheck2,
    number: "05",
    title: "Net Metering Support",
    text: "Paperwork and electricity-board coordination handled from start to finish.",
    accent: "cyan",
  },
] as const;

const process = [
  ["Site visit", "1–2 days", "We assess roof space, shadow-free area and power requirements."],
  ["Quotation", "1 day", "Your system design and transparent quotation arrive the next day."],
  ["Documentation", "1 day", "We simplify installation and subsidy paperwork for you."],
  ["Installation", "1 week", "Trained technicians install your system safely and efficiently."],
  ["Net metering", "3–4 days", "We coordinate the net meter so your savings can begin."],
] as const;

const inverterBrands = [
  "OKAYA",
  "V-GUARD SOLAR",
  "GROWATT",
  "FUJIYAMA",
  "EASTMAN",
  "MICROTEK",
  "LUMINOUS",
] as const;

const certificates = [
  {
    title: "Authorised Okaya Distributor",
    issuer: "Okaya Batteries & UPS System",
    validity: "Valid until 31 March 2027",
    image: "/okaya-distributor-certificate.png",
    width: 1024,
    height: 724,
    tone: "green",
  },
  {
    title: "DPIIT Startup Recognition",
    issuer: "Government of India",
    validity: "Valid until 11 June 2034",
    image: "/dpiit-startup-recognition-certificate.png",
    width: 1024,
    height: 734,
    tone: "blue",
  },
  {
    title: "ISO 9001:2015",
    issuer: "Quality Management System",
    validity: "Valid until 12 February 2029",
    image: "/iso-9001-certificate.png",
    width: 580,
    height: 829,
    tone: "gold",
  },
] as const;

function MagneticLink({
  href,
  children,
  variant = "primary",
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function move(event: MouseEvent<HTMLAnchorElement>) {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, { x: x * 0.14, y: y * 0.18, duration: 0.35, ease: "power2.out" });
  }

  function reset() {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, .45)" });
  }

  return (
    <a
      ref={ref}
      className={`magnetic-button ${variant}`}
      href={href}
      onMouseMove={move}
      onMouseLeave={reset}
      aria-label={ariaLabel}
    >
      <span>{children}</span>
      <ArrowRight size={17} strokeWidth={1.8} />
    </a>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`eyebrow ${dark ? "dark" : ""}`}>
      <span />
      {children}
    </div>
  );
}

function CountUp({
  to,
  suffix = "",
  duration = 1500,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    let frame = 0;
    const delay = window.setTimeout(() => {
      const startedAt = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(to * eased));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, 650);

    return () => {
      window.clearTimeout(delay);
      cancelAnimationFrame(frame);
    };
  }, [duration, to]);

  return <>{value}{suffix}</>;
}

export default function EisherSite({ page = "home" }: { page?: SitePage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sent, setSent] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<(typeof certificates)[number] | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, 110]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.15]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!selectedCertificate) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCertificate(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedCertificate]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Hello Eisher Industries, I’d like a free site visit.",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `City / Area: ${data.get("city")}`,
      `Approx. bill: ${data.get("bill") || "Not provided"}`,
      `Message: ${data.get("message") || "—"}`,
    ].join("\n");
    setSent(true);
    window.open(`https://wa.me/919422095082?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="noise" aria-hidden="true" />
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <div className="floating-actions" aria-label="Quick contact">
        <div className="floating-status"><i className="pulse-dot" /> We’re here to help</div>
        <div className="floating-buttons">
          <a
            className="floating-call"
            href="tel:+919422095082"
            aria-label="Call Eisher Industries"
          >
            <i><Phone /></i>
            <span><small>Speak with us</small>Call now</span>
          </a>
          <a
            className="floating-whatsapp"
            href="https://wa.me/919422095082?text=Hello%20Eisher%20Industries%2C%20I%20would%20like%20a%20free%20solar%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Eisher Industries on WhatsApp"
          >
            <i><MessageCircle /></i>
            <span><small>Fastest reply</small>WhatsApp</span>
            <ArrowRight />
          </a>
        </div>
      </div>

      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="brand" aria-label="Eisher Industries home">
          <span className="brand-mark">
            <Image
              src="/eisher-industries-logo.png"
              alt=""
              width={74}
              height={58}
              priority
            />
            <i />
          </span>
          <span>
            <b>EISHER</b>
            <small>INDUSTRIES LLP</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={href === "/" ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>

        <a className="nav-cta" href="https://wa.me/919422095082" target="_blank" rel="noreferrer">
          <MessageCircle size={16} />
          Free site visit
        </a>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 24px)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0 round 24px)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 24px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {navItems.map(([label, href], index) => (
              <motion.a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * index }}
              >
                <span>0{index + 1}</span>{label}<ArrowRight />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            className="certificate-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedCertificate.title} certificate preview`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              className="certificate-modal-card"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="certificate-modal-head">
                <div>
                  <small>{selectedCertificate.issuer}</small>
                  <strong>{selectedCertificate.title}</strong>
                </div>
                <button onClick={() => setSelectedCertificate(null)} aria-label="Close certificate preview"><X /></button>
              </div>
              <div className="certificate-modal-image">
                <Image
                  src={selectedCertificate.image}
                  alt={`${selectedCertificate.title} issued to Eisher Industries LLP`}
                  width={selectedCertificate.width}
                  height={selectedCertificate.height}
                  sizes="(max-width: 800px) 92vw, 850px"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main" ref={mainRef}>
        {page !== "home" && (
          <section className="page-hero" id="top">
            <div className="hero-grid" aria-hidden="true" />
            <div className="aurora aurora-one" aria-hidden="true" />
            <div className="page-hero-inner section-shell">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                EISHER / {pageIntros[page].index}
              </motion.span>
              <h1>
                <motion.i initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
                  {pageIntros[page].title}
                </motion.i>
                <motion.em initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
                  {pageIntros[page].accent}
                </motion.em>
              </h1>
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}>
                {pageIntros[page].text}
              </motion.p>
              <motion.div className="page-hero-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                <span>Poladpur, Maharashtra</span>
                <span><i className="pulse-dot" /> Nature Friend</span>
              </motion.div>
            </div>
          </section>
        )}

        {page === "home" && (<>
        <section className="hero" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <div className="aurora aurora-one" aria-hidden="true" />
          <div className="aurora aurora-two" aria-hidden="true" />

          <motion.div className="hero-copy" style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              className="hero-kicker"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
            >
              <span className="pulse-dot" />
              Solar energy, thoughtfully delivered
            </motion.div>
            <h1 aria-label="Power your home the nature-friendly way">
              <span className="line">
                <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                  Power your home
                </motion.span>
              </span>
              <span className="line">
                <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
                  the <em>nature-friendly</em> way.
                </motion.span>
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
            >
              Trusted solar installation across Konkan and western Maharashtra,
              backed by 24 years of hands-on power-sector experience.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.8 }}
            >
              <MagneticLink href="/contact">Book a free site visit</MagneticLink>
              <MagneticLink href="/process" variant="secondary">See how it works</MagneticLink>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <SolarOrbit />
            <div className="orbit-ring" aria-hidden="true" />
            <motion.div className="float-card install-card" animate={{ y: [0, -10, 0] }} transition={{ duration: 4.8, repeat: Infinity }}>
              <span><CircleCheck size={17} /></span>
              <div><small>Installed & counting</small><strong>500+</strong></div>
            </motion.div>
            <motion.div className="float-card region-card" animate={{ y: [0, 8, 0] }} transition={{ duration: 5.5, repeat: Infinity }}>
              <MapPin size={18} />
              <div><small>Serving</small><strong>6 regions</strong></div>
            </motion.div>
            <div className="nature-seal">
              <Leaf />
              <span>Nature<br />Friend</span>
            </div>
          </motion.div>

          <div className="hero-footer">
            <div>
              <strong><CountUp to={24} /></strong>
              <span>years in the<br />power sector</span>
            </div>
            <div>
              <strong><CountUp to={500} suffix="+" duration={1800} /></strong>
              <span>successful<br />installations</span>
            </div>
          </div>
        </section>

        <section className="ticker" aria-label="Our solar services">
          <div className="ticker-track">
            {[...services, ...services].map((service, index) => (
              <span key={`${service.title}-${index}`}>
                <Sun size={18} /> {service.title}
              </span>
            ))}
          </div>
        </section>

        <section className="home-proof section-pad">
          <div className="section-shell">
            <Reveal className="proof-intro">
              <Eyebrow>Why Eisher Industries</Eyebrow>
              <h2>Solar expertise that<br /><em>stays with you.</em></h2>
              <p>
                One accountable team—from understanding your electricity bill
                to switching on your net meter.
              </p>
            </Reveal>
            <div className="proof-bento">
              <Reveal className="proof-main">
                <div className="proof-main-top">
                  <span>Power sector experience</span>
                  <ShieldCheck />
                </div>
                <strong>24<sup>years</sup></strong>
                <h3>Knowledge beyond panels.</h3>
                <p>Every installation is grounded in real electrical-system expertise.</p>
                <div className="proof-rings" aria-hidden="true"><i /><i /><i /></div>
              </Reveal>
              <Reveal className="proof-installations" delay={0.08}>
                <span><Zap /></span>
                <strong>500+</strong>
                <h3>Successful installations</h3>
                <p>Homes and businesses powered across six regions.</p>
                <Link href="/why-us">Why choose us <ArrowRight /></Link>
              </Reveal>
              <Reveal className="proof-journey" delay={0.14}>
                <div>
                  <small>END-TO-END</small>
                  <h3>One seamless solar journey.</h3>
                </div>
                <div className="journey-track">
                  {["Visit", "Design", "Install", "Meter"].map((item, index) => (
                    <span key={item}><i>{index + 1}</i>{item}</span>
                  ))}
                </div>
                <Link href="/process">See our process <ArrowRight /></Link>
              </Reveal>
              <Reveal className="proof-support" delay={0.2}>
                <HandCoins />
                <div>
                  <small>SUBSIDY + FINANCE</small>
                  <h3>Guidance, handled.</h3>
                  <p>PM Surya Ghar support and flexible financing pathways.</p>
                </div>
                <Link href="/finance" aria-label="Explore subsidy and finance"><ArrowRight /></Link>
              </Reveal>
            </div>
            <Reveal className="service-area-line">
              <span><MapPin /> Proudly serving</span>
              <div>Raigad <i /> Ratnagiri <i /> Thane <i /> Pune <i /> Satara <i /> Palghar</div>
            </Reveal>
          </div>
        </section>

        <section className="home-pages section-pad">
          <div className="section-shell">
            <Reveal className="home-pages-heading">
              <Eyebrow>Everything you need to go solar</Eyebrow>
              <h2>Explore Eisher.<br /><em>Choose your next step.</em></h2>
            </Reveal>
            <div className="home-page-grid">
              {navItems.filter(([, href]) => href !== "/").map(([label, href], index) => (
                <Link href={href} key={href} className={index === 0 ? "featured" : ""}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{label}</h3>
                    <p>{pageIntros[href.slice(1) as Exclude<SitePage, "home">].text}</p>
                  </div>
                  <ArrowRight />
                </Link>
              ))}
            </div>
            <Reveal className="home-closing">
              <div><Leaf /><span>Ready to cut your electricity bill and go green?</span></div>
              <MagneticLink href="/contact">Get a free consultation</MagneticLink>
            </Reveal>
          </div>
        </section>
        </>)}

        {page === "about" && (
        <section className="about section-pad" id="about">
          <div className="section-shell">
            <Reveal className="about-heading">
              <Eyebrow>Our story</Eyebrow>
              <h2>A young company.<br /><em>Deep expertise.</em></h2>
            </Reveal>
            <div className="about-layout">
              <Reveal className="about-statement">
                <span className="quote-mark">“</span>
                <p>Every installation is backed by know-how, <strong>not guesswork.</strong></p>
                <div className="experience-orbit">
                  <span>24</span>
                  <small>years of power<br />sector experience</small>
                </div>
              </Reveal>
              <Reveal className="about-copy" delay={0.12}>
                <p>
                  Founded in 2024 in Poladpur, Raigad, Eisher Industries LLP
                  brings reliable and honest solar solutions to homes, shops
                  and industries across Konkan and western Maharashtra.
                </p>
                <div className="mission-list">
                  {[
                    ["01", "Protect the environment through clean energy"],
                    ["02", "Reduce electricity bills for families and businesses"],
                    ["03", "Make solar simple, transparent and dependable"],
                  ].map(([number, item]) => (
                    <div key={number}><span>{number}</span><p>{item}</p><Check /></div>
                  ))}
                </div>
              </Reveal>
            </div>
            <div className="credentials">
              <Reveal className="credentials-heading">
                <div>
                  <Eyebrow>Credentials & recognition</Eyebrow>
                  <h2>Verified standards.<br /><em>Visible trust.</em></h2>
                </div>
                <p>
                  Our credentials reflect a commitment to recognised quality
                  systems, transparent business practices and genuine brand partnerships.
                </p>
              </Reveal>
              <div className="certificate-grid">
                {certificates.map((certificate, index) => (
                  <motion.button
                    type="button"
                    className={`certificate-card ${certificate.tone}`}
                    key={certificate.title}
                    onClick={() => setSelectedCertificate(certificate)}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    aria-label={`View ${certificate.title} certificate`}
                  >
                    <div className="certificate-image">
                      <Image
                        src={certificate.image}
                        alt={`${certificate.title} issued to Eisher Industries LLP`}
                        width={certificate.width}
                        height={certificate.height}
                        sizes="(max-width: 820px) 92vw, 44vw"
                      />
                      <span><Sparkles /> Verified credential</span>
                    </div>
                    <div className="certificate-info">
                      <span>0{index + 1}</span>
                      <div>
                        <small>{certificate.issuer}</small>
                        <h3>{certificate.title}</h3>
                        <p>{certificate.validity}</p>
                      </div>
                      <i><ArrowRight /></i>
                    </div>
                  </motion.button>
                ))}
              </div>
              <p className="certificate-note"><ShieldCheck /> Click any certificate to view the full document.</p>
            </div>
          </div>
        </section>
        )}

        {page === "services" && (
        <section className="services section-pad" id="services">
          <div className="section-shell">
            <Reveal className="services-intro">
              <div>
                <Eyebrow>Built around your energy needs</Eyebrow>
                <h2>One partner.<br /><em>Every solar need.</em></h2>
              </div>
              <p>From the first roof measurement to years of reliable performance, we keep your solar journey connected.</p>
            </Reveal>
            <div className="service-stack">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.article
                    className={`service-row ${service.accent}`}
                    key={service.title}
                    initial={{ opacity: 0, x: index % 2 ? 35 : -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.65, delay: index * 0.04 }}
                    whileHover={{ x: 6 }}
                  >
                    <span className="service-number">{service.number}</span>
                    <div className="service-icon"><Icon /></div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <span className="service-arrow"><ArrowRight /></span>
                  </motion.article>
                );
              })}
            </div>
            <p className="warranty-note">
              <ShieldCheck size={16} />
              Warranty terms vary by product and follow the respective manufacturer or company policy. Exact terms are shared with your quotation.
            </p>
          </div>
        </section>
        )}

        {page === "products" && (
        <section className="brands section-pad" id="products">
          <div className="brand-glow" aria-hidden="true" />
          <div className="section-shell brands-layout">
            <Reveal className="brands-copy">
              <Eyebrow dark>Products & brands</Eyebrow>
              <h2>Trusted technology.<br /><em>Chosen to last.</em></h2>
              <p>
                Every system is selected for dependable performance,
                government compliance where applicable, and strong after-sales support.
              </p>
              <div className="product-pills">
                <span><Gauge /> Premium inverters</span>
                <span><BatteryCharging /> Reliable batteries</span>
                <span><Sun /> Compliant solar panels</span>
              </div>
            </Reveal>
            <Reveal className="brands-constellation" delay={0.12}>
              <div className="brand-core"><Zap /><span>Power you<br />can trust</span></div>
              {inverterBrands.map((brand, index) => (
                <motion.span
                  key={brand}
                  className={`brand-chip chip-${index + 1}`}
                  animate={{ y: [0, index % 2 ? 7 : -7, 0] }}
                  transition={{ duration: 4 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
                >
                  {brand}
                </motion.span>
              ))}
            </Reveal>
          </div>
          <div className="battery-strip section-shell">
            <span>Battery partners</span><strong>OKAYA</strong><strong>EXIDE</strong><strong>EASTMAN</strong>
          </div>
        </section>
        )}

        {page === "process" && (
        <section className="process section-pad" id="process">
          <div className="section-shell">
            <Reveal className="process-heading">
              <Eyebrow>Simple from day one</Eyebrow>
              <h2>From sunlight to savings<br /><em>in five clear steps.</em></h2>
            </Reveal>
            <div className="process-grid">
              <div className="process-line" aria-hidden="true" />
              {process.map(([title, duration, text], index) => (
                <motion.article
                  key={title}
                  className="process-step"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                >
                  <div className="step-node"><span>{index + 1}</span></div>
                  <small>{duration}</small>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </motion.article>
              ))}
            </div>
            <Reveal className="process-cta">
              <div><Sparkles /><span>Your roof could be next.</span></div>
              <MagneticLink href="/contact">Start with a free visit</MagneticLink>
            </Reveal>
          </div>
        </section>
        )}

        {page === "finance" && (
        <section className="finance section-pad" id="finance">
          <div className="section-shell">
            <Reveal className="finance-title">
              <Eyebrow dark>Subsidy & finance</Eyebrow>
              <h2>Solar made more<br /><em>accessible.</em></h2>
            </Reveal>
            <div className="finance-layout">
              <Reveal className="subsidy-card">
                <div className="subsidy-top">
                  <span className="scheme-chip">PM SURYA GHAR</span>
                  <Sun />
                </div>
                <h3>End-to-end subsidy guidance</h3>
                <p>
                  We help eligible residential customers understand eligibility,
                  prepare documentation and complete the application process.
                </p>
                <div className="guidance-flow">
                  <span>Eligibility</span><ChevronRight />
                  <span>Documents</span><ChevronRight />
                  <span>Application</span>
                </div>
                <small>Subsidy amount and eligibility are decided by the government and may change under prevailing scheme guidelines.</small>
              </Reveal>
              <Reveal className="finance-options" delay={0.12}>
                <div className="finance-intro">
                  <HandCoins />
                  <div><small>Flexible ways to begin</small><h3>Finance your sunshine.</h3></div>
                </div>
                {[
                  [Banknote, "Public Sector Bank", "Solar loans"],
                  [BadgeIndianRupee, "Bajaj Finance", "Finance options"],
                  [Leaf, "Ecofy Finance", "Green financing"],
                ].map(([Icon, name, detail]) => {
                  const FinanceIcon = Icon as typeof Banknote;
                  return (
                    <div className="finance-row" key={name as string}>
                      <span><FinanceIcon /></span>
                      <div><strong>{name as string}</strong><small>{detail as string}</small></div>
                      <ArrowRight />
                    </div>
                  );
                })}
                <p>Interest rates, tenure and eligibility follow each finance partner’s approval and current policies.</p>
              </Reveal>
            </div>
          </div>
        </section>
        )}

        {page === "why-us" && (
        <section className="trust section-pad" id="trust">
          <div className="section-shell">
            <Reveal className="trust-title">
              <Eyebrow>Why Eisher</Eyebrow>
              <h2>Trust, built into<br /><em>every connection.</em></h2>
            </Reveal>
            <div className="trust-grid">
              <Reveal className="trust-hero-card">
                <span className="trust-icon"><ShieldCheck /></span>
                <div className="big-number">24<sup>yrs</sup></div>
                <h3>Experience you can rely on</h3>
                <p>We understand electricity systems inside out—not just solar panels.</p>
                <div className="signal-lines" aria-hidden="true"><i /><i /><i /><i /></div>
              </Reveal>
              <Reveal className="trust-card installs" delay={0.08}>
                <span><Zap /></span>
                <strong>500+</strong>
                <h3>Proven installations</h3>
                <p>Across Raigad, Ratnagiri, Thane, Pune, Satara and Palghar.</p>
              </Reveal>
              <Reveal className="trust-card support" delay={0.16}>
                <span><Headphones /></span>
                <h3>Support beyond installation</h3>
                <p>Subsidy, net metering and after-sales care stay connected.</p>
                <div className="support-path">
                  <i /><i /><i /><i />
                </div>
              </Reveal>
              <Reveal className="trust-quote" delay={0.24}>
                <Quote />
                <p>Reliable. Honest.<br />Nature-friendly.</p>
                <small>That’s the Eisher promise.</small>
              </Reveal>
            </div>
          </div>
        </section>
        )}

        {page === "contact" && (
        <section className="contact section-pad" id="contact">
          <div className="contact-orb" aria-hidden="true" />
          <div className="section-shell contact-layout">
            <Reveal className="contact-copy">
              <Eyebrow dark>Let’s talk solar</Eyebrow>
              <h2>Put your roof<br /><em>to work.</em></h2>
              <p>Start with a free site visit and a clear, no-pressure conversation about your energy needs.</p>
              <div className="contact-links">
                <a href="tel:+919422095082"><span><Phone /></span><div><small>Call or WhatsApp</small><strong>+91 94220 95082</strong></div></a>
                <a href="mailto:eicherindus@gmail.com"><span><Mail /></span><div><small>Email us</small><strong>eicherindus@gmail.com</strong></div></a>
                <div><span><MapPin /></span><div><small>Visit us</small><strong>285, Bazar Peth, Poladpur,<br />Raigad – 402303</strong></div></div>
              </div>
            </Reveal>
            <Reveal className="contact-form-wrap" delay={0.12}>
              <div className="form-heading">
                <div><span className="pulse-dot" />Replies on WhatsApp</div>
                <strong>Free site visit</strong>
              </div>
              <form onSubmit={handleSubmit}>
                <label><span>Your name</span><input name="name" type="text" required placeholder="Name" autoComplete="name" /></label>
                <div className="form-row">
                  <label><span>Phone number</span><input name="phone" type="tel" required placeholder="+91" autoComplete="tel" pattern="[0-9+ ()-]{10,}" /></label>
                  <label><span>City / area</span><input name="city" type="text" required placeholder="e.g. Poladpur" autoComplete="address-level2" /></label>
                </div>
                <label><span>Approx. monthly electricity bill</span><input name="bill" type="text" inputMode="numeric" placeholder="₹ 3,000" /></label>
                <label><span>Anything else?</span><textarea name="message" rows={3} placeholder="Tell us about your requirement" /></label>
                <button className="submit-button" type="submit">
                  <span>{sent ? "Open WhatsApp again" : "Request my free visit"}</span><ArrowRight />
                </button>
                <small className="privacy-note"><ShieldCheck /> Your details are only used to contact you about solar.</small>
              </form>
            </Reveal>
          </div>
        </section>
        )}
      </main>

      <footer>
        <div className="section-shell">
          <div className="footer-top">
            <Link href="/" className="footer-brand">
              <Image src="/eisher-industries-logo.png" alt="Eisher Industries LLP" width={86} height={66} />
              <div><strong>EISHER INDUSTRIES LLP</strong><span>NATURE FRIEND</span></div>
            </Link>
            <div className="footer-areas">
              <small>Serving across</small>
              <p>Raigad · Ratnagiri · Thane<br />Pune · Satara · Palghar</p>
            </div>
            <a className="footer-whatsapp" href="https://wa.me/919422095082" target="_blank" rel="noreferrer">
              <MessageCircle /> Chat on WhatsApp <ArrowRight />
            </a>
          </div>
          <div className="footer-nav">
            <div>
              <small>Explore</small>
              {navItems.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            </div>
            <div>
              <small>Solutions</small>
              <Link href="/services">Residential solar</Link>
              <Link href="/services">Commercial solar</Link>
              <Link href="/services">Industrial solar</Link>
              <Link href="/services">Maintenance</Link>
            </div>
            <div className="footer-line">
              <Leaf />
              <p>Cleaner energy.<br />Lower bills.<br /><em>A brighter tomorrow.</em></p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Eisher Industries LLP. All rights reserved.</span>
            <p>PM Surya Ghar subsidy is subject to prevailing government rules. Product warranties follow manufacturer or company policy. Finance is subject to partner approval and conditions.</p>
            <a href="#top" aria-label="Back to top">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </>
  );
}
