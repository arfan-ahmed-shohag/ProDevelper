import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { LegalDocumentContent } from "@/components/LegalDocumentContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Prodeveloper handles information shared through this website and project inquiries.",
  alternates: { canonical: "/privacy-policy/" },
};

const privacySections = [
  {
    title: "1. Log Files",
    content:
      "Prodeveloper follows a standard procedure of using log files. These files may record visitors when they visit the website. Information can include IP addresses, browser type, internet service provider, date and time stamps, and referring or exit pages.",
  },
  {
    title: "2. Cookies and Web Beacons",
    content:
      "Like many websites, this site may use cookies to store visitor preferences and improve the experience by tailoring page content to browser type or other information.",
  },
  {
    title: "3. Information We Collect",
    content:
      "When you contact us through a project inquiry form, we may ask for information such as:",
    details: [
      "Name and email address",
      "Project requirements and business details",
      "Phone number (optional)",
    ],
  },
  {
    title: "4. Third-Party Privacy Policies",
    content:
      "This Privacy Policy does not apply to other advertisers or websites. We recommend reviewing the privacy policies of any third-party services or websites you visit.",
  },
  {
    title: "5. Consent",
    content:
      "By using this website, you acknowledge this Privacy Policy and agree to its terms.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        variant="showcase"
        badge="Trust & Transparency"
        badgePulse
        title="Our Commitment to"
        outline="Privacy."
        description={
          <>
            At <strong>Prodeveloper</strong>, your data security matters. This
            policy explains how information shared through this website is
            collected and used to provide a safe experience.
          </>
        }
      />

      <LegalDocumentContent
        eyebrow="Privacy Documentation"
        title="Detailed"
        outline="Guidelines."
        introduction={
          <>
            At <strong className="text-slate-900">Prodeveloper</strong> (Nizam
            Uddin), reachable at{" "}
            <a
              className="text-brand-green hover:underline"
              href="https://prodeveloper2.com"
            >
              prodeveloper2.com
            </a>
            , we respect our visitors’ privacy. This policy describes the
            information that may be collected through this website and how it
            may be used.
          </>
        }
        sections={privacySections}
      />
    </>
  );
}
