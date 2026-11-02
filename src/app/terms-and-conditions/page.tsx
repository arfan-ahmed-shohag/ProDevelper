import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { LegalDocumentContent } from "@/components/LegalDocumentContent";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms that apply to using the Prodeveloper website and engaging its professional services.",
  alternates: { canonical: "/terms-and-conditions/" },
};

const termsSections = [
  {
    title: "1. Service Provision",
    content:
      "We provide expert solutions in Full-stack engineering, WordPress development, and UI/UX design. Each project is handled as a separate legal agreement. We reserve the right to refuse service to anyone for any reason at any time.",
  },
  {
    title: "2. Intellectual Property Rights",
    content:
      "Unless otherwise stated, Nizam Uddin (Prodeveloper) owns the intellectual property rights for all material on this website. Once the final project payment is settled, the ownership of the specific source code and design assets is transferred to the client.",
  },
  {
    title: "3. Payment & Deposits",
    content:
      "To initiate any project, a non-refundable deposit (as specified in the quotation) is required. Final files will only be delivered or deployed to live servers after the 100% remaining balance is cleared.",
  },
  {
    title: "4. Project Timelines",
    content:
      "While we strive to meet all deadlines, project delivery dates are estimates. Delays in client feedback or technical complexities may result in timeline adjustments.",
  },
  {
    title: "5. Limitation of Liability",
    content:
      "In no event shall Prodeveloper be liable for any damages (including loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials provided.",
  },
  {
    title: "6. Governing Law",
    content:
      "These terms and conditions are governed by and construed in accordance with the laws of Bangladesh and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHero
        variant="showcase"
        badge="Guidelines & Cooperation"
        badgePulse
        title="Legal Terms &"
        outline="Conditions."
        description={
          <>
            Clear and transparent agreements for our{" "}
            <span className="font-bold text-brand-light">
              professional services
            </span>
            , project management, and mutual standards.
          </>
        }
      />

      <LegalDocumentContent
        eyebrow="Standard Agreement"
        title="Service"
        outline="Policies."
        introduction={
          <>
            Welcome to <strong className="text-slate-900">Prodeveloper</strong>.
            By accessing this website and hiring our services, you accept these
            terms and conditions in full. Do not continue to use the website if
            you do not accept all of the terms stated here.
          </>
        }
        introductionClassName="text-lg italic"
        sections={termsSections}
      />
    </>
  );
}
