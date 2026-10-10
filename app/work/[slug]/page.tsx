import { PageIn, TLink } from "@/components/Transitions";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/content/data";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: `${p.title} — Saif Ullah`, description: p.summary } : {};
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  // only show facts and sections that actually have content
  const facts = [["Client", p.client], ["Role", p.role], ["Tools", p.tools.join(", ")], ...p.metrics.map((m) => [m.label, m.value])].filter(([, v]) => v && v !== "—");
  const story = [["Challenge", p.challenge], ["Approach", p.approach], ["Result", p.result]].filter(([, t]) => t);

  return (
    <main className="px-[var(--gutter)] pb-24 pt-28">
      <PageIn slide className="wrap">
        <TLink href="/" className="glass inline-block rounded-full px-5 py-2.5 text-sm">← All work</TLink>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
          <div className="glass-lite aspect-[9/16] w-full max-w-[380px] overflow-hidden rounded-[36px] p-2">
            <div className="relative h-full w-full overflow-hidden rounded-[30px]" style={{ background: `linear-gradient(160deg, ${p.hue[0]}, ${p.hue[1]})` }}>
              {p.youtube ? (
                <YouTubeEmbed id={p.youtube} title={p.title} poster={p.poster} />
              ) : p.video ? (
                <video src={p.video} poster={p.poster} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <span className="label absolute inset-x-0 bottom-6 text-center !text-white/80">Video coming soon</span>
              )}
            </div>
          </div>

          <div>
            <p className="label mb-4">{[p.category, p.year].filter(Boolean).join(" · ")}</p>
            <h1 className="display text-[clamp(2.75rem,8vw,7rem)]">{p.title}</h1>
            <p className="mt-6 max-w-xl text-xl text-mist">{p.summary}</p>

            {facts.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {facts.map(([k, v]) => (
                  <div key={k} className="glass-lite rounded-2xl p-4">
                    <dt className="label mb-1">{k}</dt>
                    <dd className="text-lg">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {story.length > 0 && (
              <div className="mt-14 grid gap-10">
                {story.map(([h, t]) => (
                  <section key={h}>
                    <h2 className="label mb-3 !text-amber">{h}</h2>
                    <p className="max-w-2xl text-xl leading-relaxed text-snow/90">{t}</p>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>

        <TLink href={`/work/${next.slug}`} className="glass mt-24 flex items-center justify-between rounded-[32px] p-8 md:p-12">
          <span><span className="label mb-2 block">Next project</span><span className="display text-4xl md:text-6xl">{next.title}</span></span>
          <span className="text-4xl" aria-hidden>→</span>
        </TLink>
      </PageIn>
    </main>
  );
}
