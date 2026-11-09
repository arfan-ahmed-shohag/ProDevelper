import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ClientFeedbackGallery from "@/components/feedback/ClientFeedbackGallery";

export const metadata: Metadata = {
  title: "Client Feedback",
  description:
    "Read client feedback and stories from businesses that have grown with Prodeveloper.",
  alternates: { canonical: "/client-feedback/" },
};

export default function ClientFeedbackPage() {
  return (
    <>
      <PageHero
        badge="Voice of Our Clients"
        title="Real Impact,"
        highlight="Measured"
        subtitle="by"
        outline="Client Growth."
        description="I don't just deliver projects; I deliver results that boost business performance. Join a community of successful partners who have experienced up to a 250% growth boost through precision engineering."
        stats={[
          { value: "260+", label: "Global Clients" },
          { value: "4.9/5", label: "Average Rating" },
          { value: "99%", label: "Retention Rate" },
          { value: "250%", label: "Growth Boost" },
        ]}
      />
      <ClientFeedbackGallery initialData={{ items: [], page: 1, total: 0, totalPages: 0 }} />
    </>
  );
}
