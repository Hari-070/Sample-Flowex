export default function UseCases() {
  return (
    <section className="py-24 border-t border-border bg-muted/20">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Designed For Busy Humans
          </h2>

          <ul className="space-y-4 text-muted-foreground">
            <li>• Founders managing investors & clients</li>
            <li>• Sales teams booking back-to-back demos</li>
            <li>• Executives drowning in email</li>
            <li>• Remote teams across time zones</li>
          </ul>
        </div>

        <div className="p-8 rounded-2xl border border-border bg-card">
          <p className="text-lg leading-relaxed">
            “Orbit AI cut my inbox time by 70%. It handles scheduling
            automatically and even follows up when someone forgets to reply.
            It’s like having a full-time assistant.”
          </p>

          <p className="mt-6 text-sm text-muted-foreground">
            — Early Beta User
          </p>
        </div>
      </div>
    </section>
  );
}