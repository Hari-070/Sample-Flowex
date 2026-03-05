import Hero from "@/src/components/sections/hero";
import Features from "@/src/components/sections/features";
import UseCases from "@/src/components/sections/use-cases";
import CTA from "@/src/components/sections/cta";

export default function LandingPage() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <Features />
      <UseCases />
      <CTA />
    </main>
  );
}