import { Mail, Calendar, Clock, Shield } from "lucide-react";

const features = [
  {
    icon: Mail,
    title: "Smart Email Replies",
    description:
      "Drafts contextual replies in your tone and sends them automatically when approved.",
  },
  {
    icon: Calendar,
    title: "Auto Scheduling",
    description:
      "Finds optimal meeting times and sends calendar invites without back-and-forth.",
  },
  {
    icon: Clock,
    title: "Focus Blocking",
    description:
      "Automatically blocks deep-work sessions based on your workload.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "End-to-end encrypted. Your data is never used for training.",
  },
];

export default function Features() {
  return (
    <section className="py-24 border-t border-border">
      <div className="container mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Finally, An AI That Actually Works For You
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Orbit AI acts like your executive assistant — proactive, intelligent,
          and always on.
        </p>
      </div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-xl border border-border bg-card hover:border-blue-400/40 transition"
            >
              <Icon className="mb-4 text-blue-400" size={28} />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}