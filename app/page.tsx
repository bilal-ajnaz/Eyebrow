import Hero from "@/components/Hero";
import NotchStage from "@/components/NotchStage";
import Showcase from "@/components/Showcase";
import { Privacy, Pricing, Faq } from "@/components/Sections";
import { faqs } from "@/lib/features";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: site.name,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: site.minMacOS,
      description: site.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

/* The tour plays in one screen, the rest of the app fits in one bento,
   and the full lists live on /features. */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <NotchStage />
      <Showcase />
      <Privacy />
      <Pricing />
      <Faq />
    </>
  );
}
