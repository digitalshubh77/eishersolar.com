import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EisherSite, { type SitePage } from "@/components/eisher-site";

const pages: Record<string, { page: Exclude<SitePage, "home">; title: string; description: string }> = {
  about: {
    page: "about",
    title: "About Us",
    description: "About EISHER INDUSTRIES LLP—Konkan’s trusted solar partner for homes, businesses and industries.",
  },
  services: {
    page: "services",
    title: "Solar Services",
    description: "Residential, commercial and industrial solar installation, maintenance and net metering support.",
  },
  products: {
    page: "products",
    title: "Solar Products & Trusted Brands",
    description: "Explore the reliable inverter, battery and solar technology brands trusted by Eisher Industries.",
  },
  process: {
    page: "process",
    title: "Solar Installation Process",
    description: "See our clear five-step solar journey from free site visit through installation and net metering.",
  },
  finance: {
    page: "finance",
    title: "Solar Subsidy & Finance",
    description: "Get PM Surya Ghar subsidy guidance and explore available bank, Bajaj Finance and Ecofy options.",
  },
  "why-us": {
    page: "why-us",
    title: "Why Choose Eisher Industries",
    description: "Choose proven solar expertise, 500+ installations and support beyond installation.",
  },
  contact: {
    page: "contact",
    title: "Contact Us",
    description: "Book a free solar site visit with Eisher Industries across Konkan and western Maharashtra.",
  },
  "solar-calculator": {
    page: "calculator",
    title: "Solar Calculator",
    description: "Estimate your suitable solar system capacity, annual generation and potential electricity bill savings.",
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = pages[slug];
  if (!route) return {};

  return {
    title: route.title,
    description: route.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: route.title,
      description: route.description,
      url: `https://eishersolar.com/${slug}`,
    },
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = pages[slug];
  if (!route) notFound();

  return <EisherSite page={route.page} />;
}
