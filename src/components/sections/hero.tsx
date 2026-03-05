"use client";

import { Component as Globe } from "@/src/components/ui/interactive-globe";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-6">
            Autonomous AI Assistant
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            Your AI That
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Handles Email & Calendar
            </span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-lg mb-8">
            Orbit AI writes emails, schedules meetings, blocks focus time,
            and follows up automatically — so you never miss a message or
            double-book again.
          </p>

          <div className="flex gap-4">
            <Button size="lg" className="gap-2">
              Start Free Trial
              <ArrowRight size={18} />
            </Button>

            <Button variant="outline" size="lg">
              See Demo
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-8 text-sm text-muted-foreground">
            <div>
              <p className="text-2xl font-bold text-foreground">10k+</p>
              <p>Emails Automated</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">99.9%</p>
              <p>Scheduling Accuracy</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Globe size={480} />
        </div>
      </div>
    </section>
  );
}