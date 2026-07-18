import EisherSite from "@/components/eisher-site";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  name: "Eisher Industries LLP",
  slogan: "Nature Friend",
  url: "https://eishersolar.com",
  email: "eicherindus@gmail.com",
  telephone: "+91-94220-95082",
  foundingDate: "2024",
  image: "https://eishersolar.com/eisher-industries-logo.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "285, Bazar Peth, At. Post Taluka Poladpur",
    addressLocality: "Poladpur",
    addressRegion: "Maharashtra",
    postalCode: "402303",
    addressCountry: "IN",
  },
  areaServed: ["Raigad", "Ratnagiri", "Thane", "Pune", "Satara", "Palghar"],
  makesOffer: [
    "Residential Solar Installation",
    "Commercial Solar",
    "Industrial Solar",
    "Solar Maintenance and Repair",
    "Net Metering Support",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <EisherSite />
    </>
  );
}
