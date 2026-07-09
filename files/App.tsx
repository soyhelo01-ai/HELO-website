/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  TrendingDown,
  Hourglass,
  MonitorOff,
  Megaphone,
  Code,
  Brain,
  Palette,
  Target,
  BarChart3,
  Quote,
  Star,
  ArrowUpRight,
  Menu,
  X,
  Send,
  CheckCircle2,
  Loader2,
  Instagram,
  Linkedin,
  MessageCircle,
  Mail,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { ReactNode, FormEvent, MouseEvent as ReactMouseEvent, ChangeEvent } from "react";

// ---------------------------------------------------------------------------
// Config — pegá acá tu webhook de n8n (o cualquier endpoint) para que el
// formulario de contacto envíe los datos automáticamente. Si lo dejás vacío,
// el formulario simula el envío (útil para probar el diseño sin backend).
// ---------------------------------------------------------------------------
const CONTACT_WEBHOOK_URL = "";
const WHATSAPP_NUMBER = "541131585588";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Wrapper de aparición al hacer scroll — consistente en toda la web. */
const Reveal = ({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/** Cuenta hacia arriba cuando el elemento entra en el viewport. Sin deps externas. */
function useCountUp(target: number, decimals = 0, duration = 1500) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let started = false;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
              setDisplay((target * eased).toFixed(decimals));
              if (p < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, decimals, duration]);

  return { ref, display };
}

const Stat = ({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) => {
  const { ref, display } = useCountUp(value, decimals);
  return (
    <div className="text-center md:text-left">
      <div className="text-3xl md:text-4xl font-headline font-black text-white tabular-nums">
        {prefix}
        <span ref={ref}>{display}</span>
        {suffix}
      </div>
      <div className="text-[11px] md:text-xs text-on-surface-variant uppercase tracking-widest mt-1 max-w-[14ch]">
        {label}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Nosotros", href: "#agencia" },
  { label: "Contacto", href: "#contacto" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "glass-nav shadow-[0_20px_50px_rgba(255,31,191,0.08)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="flex justify-between items-center w-full px-6 md:px-8 py-3 max-w-7xl mx-auto">
        <a href="#" className="shrink-0" aria-label="HELO — inicio">
          <img src="/helo-logo.png" alt="HELO" className="h-6 md:h-7 w-auto" />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 items-center">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-headline font-black tracking-wider uppercase text-on-surface-variant hover:text-white transition-colors duration-300 text-sm"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block bg-transparent border border-primary-container text-primary px-6 py-2 rounded-sm font-headline uppercase font-bold tracking-widest transition-all duration-200 hover:bg-primary-container/10 active:scale-95 text-center text-sm"
          >
            Empecemos
          </a>
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-background border-b border-outline-variant overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-5">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-headline font-black tracking-wider uppercase text-on-surface-variant text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary-container text-on-primary py-3 rounded-sm font-headline uppercase font-bold tracking-widest text-center"
              >
                Empecemos
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const handleMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y2 = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${x}%`);
    e.currentTarget.style.setProperty("--my", `${y2}%`);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden dot-grid"
    >
      <div className="hero-mesh absolute inset-0 -z-10" aria-hidden="true" />

      <motion.div style={{ y, opacity }} className="max-w-5xl mx-auto px-6 md:px-8 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary-container font-headline uppercase tracking-[0.3em] mb-6 text-xs md:text-sm font-bold"
        >
          Agencia de marketing · desarrollo · automatización IA
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-8xl font-headline font-black tracking-tight leading-[0.95] mb-8 text-balance"
        >
          TU MARCA, LISTA PARA{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
            JUGAR EN OTRA LIGA.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-lg md:text-2xl text-on-surface-variant max-w-2xl mx-auto mb-12 font-body font-light text-balance"
        >
          Marketing con cabeza, webs que convierten y automatización con IA para que tu
          equipo deje de perder tiempo en lo que no importa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row gap-5 justify-center items-center mb-20"
        >
          <a
            href="#contacto"
            className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-black uppercase tracking-widest rounded-sm hover:shadow-[0_0_30px_rgba(255,31,191,0.4)] transition-all duration-300 transform hover:-translate-y-1"
          >
            Agendar una llamada
          </a>
          <a
            href="#proyectos"
            className="w-full md:w-auto px-10 py-5 border border-outline-variant text-primary font-headline font-black uppercase tracking-widest rounded-sm hover:bg-surface-container-low transition-all duration-300"
          >
            Ver nuestro trabajo
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex justify-center gap-10 md:gap-16 divide-x divide-outline-variant/25"
        >
          <Stat value={40} suffix="+" label="Proyectos entregados" />
          <div className="pl-10 md:pl-16">
            <Stat value={3.4} decimals={1} suffix="x" label="ROI promedio en campañas" />
          </div>
          <div className="pl-10 md:pl-16">
            <Stat value={98} suffix="%" label="Clientes que renuevan" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Marquee ticker
// ---------------------------------------------------------------------------

const MARQUEE_ITEMS = [
  "Marketing de Performance",
  "Desarrollo Web a Medida",
  "Automatización con IA",
  "Branding & Identidad",
  "E-commerce",
  "Data Intelligence",
];

const Marquee = () => {
  const loop = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-row border-y border-outline-variant/15 bg-surface-container-lowest py-5 overflow-hidden">
      <div className="marquee-track flex w-max">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-12 pr-12 font-headline uppercase tracking-[0.2em] text-sm md:text-base text-on-surface-variant/70 shrink-0"
          >
            {item}
            <span className="text-primary-container">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const ProblemSection = () => {
  const problems = [
    {
      icon: <TrendingDown className="text-primary-container" size={36} />,
      title: "Tráfico sin conversión",
      desc: "Muchos visitantes, pocas ventas. El embudo está roto y el mensaje no le habla a la audiencia correcta.",
    },
    {
      icon: <Hourglass className="text-primary-container" size={36} />,
      title: "Procesos manuales",
      desc: "Tu equipo pierde horas en tareas repetitivas que una IA resuelve en segundos. Falta eficiencia operativa.",
    },
    {
      icon: <MonitorOff className="text-primary-container" size={36} />,
      title: "Presencia digital vieja",
      desc: "Una web lenta o desactualizada rompe la confianza antes de que el cliente vea tu propuesta de valor.",
    },
  ];

  return (
    <section className="py-28 md:py-32 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <Reveal className="mb-16 md:mb-20" y={20}>
          <h2 className="text-4xl md:text-6xl font-headline font-black mb-4 tracking-tighter text-balance">
            ¿TU NEGOCIO ESTÁ DEJANDO
            <br />
            DINERO SOBRE LA MESA?
          </h2>
          <div className="w-24 h-2 bg-primary-container" />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {problems.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="h-full p-8 md:p-10 bg-surface border-l-4 border-primary-container hover:bg-surface-container-high transition-all duration-500 group">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {p.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-headline font-bold mb-3">{p.title}</h3>
                <p className="text-on-surface-variant font-body leading-relaxed text-sm md:text-base">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Services (6)
// ---------------------------------------------------------------------------

const SERVICES = [
  {
    icon: <Megaphone size={26} />,
    title: "Marketing & Contenido",
    desc: "Estrategia de pauta y contenido que atrae a la audiencia correcta, no solo tráfico.",
    tags: ["Performance Ads", "Content Strategy"],
  },
  {
    icon: <Code size={26} />,
    title: "Desarrollo Web & Apps",
    desc: "Sitios y aplicaciones rápidas, a medida, pensadas para convertir visitas en clientes.",
    tags: ["E-commerce", "Web Apps"],
  },
  {
    icon: <Brain size={26} />,
    title: "Automatización con IA",
    desc: "Agentes y flujos que se hacen cargo de lo repetitivo para que tu equipo escale sin fricción.",
    tags: ["Chatbots", "Workflows"],
  },
  {
    icon: <Palette size={26} />,
    title: "Branding & Identidad",
    desc: "Marcas con carácter propio: identidad visual, tono de voz y un sistema coherente.",
    tags: ["Identidad Visual", "Naming"],
  },
  {
    icon: <Target size={26} />,
    title: "Performance Ads",
    desc: "Meta y Google Ads optimizados a resultado, no a métricas de vanidad.",
    tags: ["Meta Ads", "Google Ads"],
  },
  {
    icon: <BarChart3 size={26} />,
    title: "Data Intelligence",
    desc: "Dashboards y reportes que muestran qué está funcionando y qué hay que cortar.",
    tags: ["Analítica", "Reporting"],
  },
];

const ServicesSection = () => {
  return (
    <section className="py-28 md:py-32 bg-surface" id="servicios">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <Reveal className="mb-16 md:mb-20">
          <p className="text-primary-container font-headline uppercase tracking-[0.3em] mb-4 text-sm font-bold">
            Especialidades
          </p>
          <h2 className="text-4xl md:text-7xl font-headline font-black tracking-tighter">
            LO QUE HACEMOS.
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((s, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08}>
              <div className="group relative h-full p-1 bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 bg-surface-container-lowest z-10 h-full flex flex-col">
                  <div className="w-14 h-14 bg-surface-container-high flex items-center justify-center mb-6 rounded-sm group-hover:bg-primary-container transition-colors duration-300">
                    <div className="text-primary group-hover:text-on-primary transition-colors duration-300">
                      {s.icon}
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-headline font-black mb-3">{s.title}</h3>
                  <p className="text-on-surface-variant mb-6 leading-relaxed text-sm">{s.desc}</p>
                  <ul className="mt-auto space-y-2 text-xs font-headline uppercase tracking-wider text-primary">
                    {s.tags.map((tag, j) => (
                      <li key={j}>• {tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Portfolio / Case studies
// ---------------------------------------------------------------------------

const CASES = [
  {
    tag: "E-commerce · Indumentaria",
    title: "Rediseño + funnel de ventas",
    metric: "+120%",
    metricLabel: "tráfico orgánico en 4 meses",
    gradient: "from-[#ff3ac1]/35 via-[#ff3ac1]/5 to-transparent",
  },
  {
    tag: "Salud · Clínica estética",
    title: "Web + agenda automatizada",
    metric: "-65%",
    metricLabel: "tiempo administrando turnos",
    gradient: "from-[#5B9C00]/30 via-[#5B9C00]/5 to-transparent",
  },
  {
    tag: "SaaS · Startup B2B",
    title: "Landing + campaña de lanzamiento",
    metric: "3.2x",
    metricLabel: "más leads calificados",
    gradient: "from-[#ffaed9]/30 via-[#ffaed9]/5 to-transparent",
  },
  {
    tag: "Servicios · Estudio contable",
    title: "Automatización de onboarding",
    metric: "40 hs",
    metricLabel: "ahorradas por mes",
    gradient: "from-[#ff3ac1]/25 via-[#5B9C00]/10 to-transparent",
  },
];

const PortfolioSection = () => {
  return (
    <section className="py-28 md:py-32 bg-surface-container-low" id="proyectos">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <Reveal className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-primary-container font-headline uppercase tracking-[0.3em] mb-4 text-sm font-bold">
              Casos de éxito
            </p>
            <h2 className="text-4xl md:text-7xl font-headline font-black tracking-tighter">
              RESULTADOS, NO PROMESAS.
            </h2>
          </div>
          <p className="text-on-surface-variant max-w-sm text-sm md:text-base">
            Una muestra de lo último que hicimos. Contanos tu proyecto y te mostramos el
            detalle completo de casos similares al tuyo.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {CASES.map((c, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="group relative overflow-hidden rounded-lg bg-surface-container-lowest border border-outline-variant/15 hover:border-primary-container/40 transition-colors duration-500">
                <div
                  className={`relative aspect-[16/10] dot-grid bg-gradient-to-br ${c.gradient} flex items-end p-6`}
                >
                  <span className="text-7xl md:text-8xl font-headline font-black text-white/5 absolute top-4 right-6 select-none">
                    0{i + 1}
                  </span>
                  <span className="relative font-headline uppercase tracking-widest text-xs text-on-surface-variant bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                    {c.tag}
                  </span>
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-headline font-black mb-4">{c.title}</h3>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-3xl font-headline font-black text-primary-container">
                        {c.metric}
                      </div>
                      <div className="text-xs text-on-surface-variant uppercase tracking-wider mt-1">
                        {c.metricLabel}
                      </div>
                    </div>
                    <a
                      href="#contacto"
                      className="flex items-center gap-1 text-sm font-headline uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      Consultar caso
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Process / About ("Nosotros")
// ---------------------------------------------------------------------------

const ProcessSection = () => {
  const steps = [
    { num: "01", title: "Diagnóstico", desc: "Entendemos tus cuellos de botella y objetivos reales.", opacity: "opacity-20" },
    { num: "02", title: "Estrategia", desc: "Diseñamos el roadmap técnico y creativo a medida.", opacity: "opacity-40" },
    { num: "03", title: "Ejecución", desc: "Desplegamos soluciones con agilidad y precisión.", opacity: "opacity-70" },
    { num: "04", title: "Resultados", desc: "Optimización continua basada en datos reales.", opacity: "opacity-100" },
  ];

  return (
    <section className="py-28 md:py-32 bg-surface-container-lowest relative overflow-hidden" id="agencia">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-20 md:mb-24">
          <p className="text-primary-container font-headline uppercase tracking-[0.3em] mb-4 text-sm font-bold">
            Quiénes somos
          </p>
          <h2 className="text-4xl md:text-7xl font-headline font-black tracking-tighter mb-6">
            NUESTRO PROCESO.
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
            Somos un equipo chico que se mueve como uno grande: estrategas, diseñadores y
            especialistas en automatización trabajando codo a codo con vos, no como un
            proveedor más.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-outline-variant/30 -z-0" />

          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.1} className="relative z-10 text-center md:text-left">
              <div className={`text-6xl font-headline font-black text-primary-container ${step.opacity} mb-4`}>
                {step.num}
              </div>
              <h4 className="text-xl font-headline font-bold mb-2 uppercase tracking-widest">{step.title}</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

const TESTIMONIALS = [
  {
    name: "Julieta R.",
    role: "Fundadora, marca de indumentaria",
    quote:
      "Antes perdíamos horas armando reportes a mano. Hoy están automatizados y el equipo se enfoca en vender.",
  },
  {
    name: "Martín A.",
    role: "Director comercial, clínica estética",
    quote:
      "La web nueva se paga sola: en dos meses duplicamos las consultas que llegan desde Instagram.",
  },
  {
    name: "Cecilia G.",
    role: "CEO, startup B2B",
    quote:
      "Encontramos un equipo que entiende de marketing Y de tecnología. Eso hizo toda la diferencia.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-28 md:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <Reveal className="mb-16 md:mb-20 text-center max-w-2xl mx-auto">
          <p className="text-primary-container font-headline uppercase tracking-[0.3em] mb-4 text-sm font-bold">
            Lo que dicen de nosotros
          </p>
          <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tighter">
            CLIENTES QUE VUELVEN.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="h-full glass-card rounded-lg p-8 flex flex-col">
                <Quote className="text-primary-container mb-6" size={28} />
                <p className="text-on-surface font-body leading-relaxed mb-8 flex-1 text-[15px]">
                  “{t.quote}”
                </p>
                <div className="flex items-center gap-1 mb-3" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} className="fill-primary-container text-primary-container" />
                  ))}
                </div>
                <div>
                  <p className="font-headline font-bold text-white text-sm">{t.name}</p>
                  <p className="text-on-surface-variant text-xs uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

const FAQS = [
  {
    question: "¿Qué servicios ofrece HELO?",
    answer:
      "Marketing estratégico y de performance, desarrollo de sitios y aplicaciones a medida de alto impacto, y automatización inteligente de procesos de negocio con IA.",
  },
  {
    question: "¿Cómo funciona el proceso de automatización con IA?",
    answer:
      "Analizamos tus cuellos de botella operativos, diseñamos flujos de trabajo automatizados y desplegamos agentes inteligentes (chatbots, integraciones) para eliminar tareas manuales repetitivas.",
  },
  {
    question: "¿Cuánto tiempo toma ver resultados?",
    answer:
      "En campañas de marketing y optimizaciones de embudo solemos ver mejoras en las primeras semanas. Los proyectos de automatización y desarrollo a medida se entregan en fases incrementales para acelerar el retorno.",
  },
  {
    question: "¿Trabajan con empresas de todos los tamaños?",
    answer:
      "Nos enfocamos en marcas y empresas en crecimiento (e-commerce, startups y corporativos) en Latinoamérica que buscan escalar su facturación y su eficiencia operativa.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-28 md:py-32 bg-surface-container-low" id="faq">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-primary-container font-headline uppercase tracking-[0.3em] mb-4 text-sm font-bold">
            Dudas comunes
          </p>
          <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tighter">
            PREGUNTAS FRECUENTES.
          </h2>
        </Reveal>

        <div className="space-y-5">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={i} delay={i * 0.06}>
                <div className="border border-outline-variant/20 rounded-lg overflow-hidden bg-surface transition-colors duration-300">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-surface-container-high transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <span className="font-headline font-bold text-base md:text-xl text-white">
                      {faq.question}
                    </span>
                    <span
                      className="text-primary-container font-headline text-2xl transition-transform duration-300 block select-none shrink-0"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-on-surface-variant font-body leading-relaxed text-sm md:text-base border-t border-outline-variant/10 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

type FormStatus = "idle" | "sending" | "success" | "error";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");

  const update = (field: keyof typeof form) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;

    setStatus("sending");
    try {
      if (CONTACT_WEBHOOK_URL) {
        const res = await fetch(CONTACT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, source: "helo-website", sentAt: new Date().toISOString() }),
        });
        if (!res.ok) throw new Error("Webhook respondió con error");
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }
      setStatus("success");
    } catch (err) {
      console.warn("[contact-form] envío falló:", err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-surface-container-low border border-outline-variant/30 rounded-sm px-4 py-3 text-sm text-white placeholder:text-on-surface-variant/50 focus:border-primary-container outline-none transition-colors duration-200";

  return (
    <section className="py-28 md:py-32 bg-surface relative overflow-hidden" id="contacto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,31,191,0.10)_0%,transparent_60%)] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-7xl font-headline font-black tracking-tighter mb-6 text-balance">
            ¿LISTO PARA DAR EL SIGUIENTE PASO?
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg">
            Contanos sobre tu negocio y te respondemos en menos de 24&nbsp;hs hábiles con los
            próximos pasos.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-5 gap-10 md:gap-12">
          {/* Direct contact column */}
          <Reveal className="md:col-span-2 flex flex-col gap-6" delay={0.05}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 glass-card rounded-lg hover:border-primary-container/40 transition-colors duration-300 group"
            >
              <div className="w-11 h-11 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                <MessageCircle size={20} className="text-secondary" />
              </div>
              <div>
                <p className="font-headline font-bold text-white text-sm">WhatsApp directo</p>
                <p className="text-on-surface-variant text-xs">Respuesta más rápida</p>
              </div>
              <ArrowUpRight size={16} className="ml-auto text-on-surface-variant group-hover:text-primary transition-colors" />
            </a>

            <a
              href="mailto:hola@heloagency.com"
              className="flex items-center gap-4 p-5 glass-card rounded-lg hover:border-primary-container/40 transition-colors duration-300 group"
            >
              <div className="w-11 h-11 rounded-full bg-primary-container/15 flex items-center justify-center shrink-0">
                <Mail size={20} className="text-primary-container" />
              </div>
              <div>
                <p className="font-headline font-bold text-white text-sm">Email</p>
                <p className="text-on-surface-variant text-xs">hola@heloagency.com</p>
              </div>
              <ArrowUpRight size={16} className="ml-auto text-on-surface-variant group-hover:text-primary transition-colors" />
            </a>

            <div className="flex gap-4 mt-2">
              {[
                { icon: <Instagram size={18} />, label: "Instagram" },
                { icon: <Linkedin size={18} />, label: "LinkedIn" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-11 h-11 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary-container/40 transition-colors duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </Reveal>

          {/* Form column */}
          <Reveal className="md:col-span-3" delay={0.1}>
            <div className="glass-card rounded-lg p-6 md:p-10 relative overflow-hidden min-h-[420px]">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center py-16 gap-4"
                  >
                    <CheckCircle2 size={48} className="text-secondary" />
                    <h3 className="text-2xl font-headline font-black">¡Listo, lo recibimos!</h3>
                    <p className="text-on-surface-variant max-w-sm text-sm">
                      Gracias, {form.name.split(" ")[0] || "genia"}. Te vamos a escribir muy
                      pronto a {form.email}.
                    </p>
                    <button
                      onClick={() => {
                        setForm({ name: "", email: "", phone: "", service: "", message: "" });
                        setStatus("idle");
                      }}
                      className="mt-4 text-primary-container font-headline uppercase tracking-widest text-sm hover:text-primary transition-colors"
                    >
                      Enviar otro mensaje
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-5"
                  >
                    {status === "error" && (
                      <div className="text-sm text-primary bg-primary-container/10 border border-primary-container/30 rounded-sm px-4 py-3">
                        No pudimos enviar tu mensaje. Probá de nuevo o escribinos por WhatsApp.
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                          Nombre*
                        </label>
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={update("name")}
                          placeholder="Tu nombre"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                          Email*
                        </label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={update("email")}
                          placeholder="vos@empresa.com"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={update("phone")}
                          placeholder="Opcional"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                          Servicio de interés
                        </label>
                        <select value={form.service} onChange={update("service")} className={inputClass}>
                          <option value="">Elegí una opción</option>
                          <option value="Marketing & Contenido">Marketing & Contenido</option>
                          <option value="Desarrollo Web">Desarrollo Web</option>
                          <option value="Automatización con IA">Automatización con IA</option>
                          <option value="No estoy seguro">Aún no estoy seguro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                        Contanos sobre tu proyecto*
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={update("message")}
                        placeholder="¿Qué te gustaría lograr?"
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="mt-2 w-full md:w-auto self-start px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-black uppercase tracking-widest rounded-sm hover:shadow-[0_0_25px_rgba(255,31,191,0.35)] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Enviando…
                        </>
                      ) : (
                        <>
                          Enviar mensaje
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0E0E0E] py-16 md:py-20 border-t border-primary-container/10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div>
            <img src="/helo-logo.png" alt="HELO" className="h-7 w-auto mb-6" />
            <p className="text-on-surface-variant font-headline text-sm tracking-tight max-w-xs leading-relaxed">
              Elevando el estándar digital en Latinoamérica a través de tecnología y
              creatividad disruptiva.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 w-full md:w-auto">
            <div className="flex flex-col gap-3">
              <p className="font-bold uppercase text-xs tracking-widest text-primary-container">Navegación</p>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-bold uppercase text-xs tracking-widest text-primary-container">Legal</p>
              {["Privacidad", "Términos"].map((link) => (
                <a key={link} className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm" href="#">
                  {link}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-bold uppercase text-xs tracking-widest text-primary-container">Social</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm"
              >
                WhatsApp
              </a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm">
                Instagram
              </a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-outline-variant/10 text-center">
          <p className="text-on-surface-variant font-headline text-xs opacity-50 tracking-widest">
            © {year} HELO DIGITAL AGENCY. TODOS LOS DERECHOS RESERVADOS.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <ProblemSection />
        <ServicesSection />
        <PortfolioSection />
        <ProcessSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
