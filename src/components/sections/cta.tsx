import { Button } from "@/src/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24 border-t border-border text-center">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Stop Managing Your Inbox.
          <br />
          Let AI Handle It.
        </h2>

        <p className="text-muted-foreground mb-8">
          Connect your email and calendar in under 2 minutes.
          No complex setup. No prompt engineering.
        </p>

        <Button size="lg" className="px-10">
          Get Started Free
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          No credit card required
        </p>
      </div>
    </section>
  );
}