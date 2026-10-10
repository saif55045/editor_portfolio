"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, animate, motion } from "motion/react";
import { budgets, profile, projectTypes } from "@/content/data";
import { Reveal, SplitText } from "@/components/motion/Reveal";
import Magnetic from "@/components/ui/Magnetic";

const schema = z.object({
  name: z.string().min(2, "Tell me your name"),
  email: z.string().email("That email looks off"),
  type: z.string().min(1, "Pick one"),
  budget: z.string().min(1, "Pick one"),
  deadline: z.string().optional(),
  message: z.string().min(10, "A few more words please"),
  website: z.string().max(0).optional(), // honeypot
});
type FormData = z.infer<typeof schema>;

const field = "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-snow placeholder:text-fog outline-none transition-colors focus:border-iris/70 focus:bg-white/[0.07]";

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [state, setState] = useState<"idle" | "rendering" | "done" | "error">("idle");
  const [pct, setPct] = useState(0);
  const [copied, setCopied] = useState(false);
  const [detail, setDetail] = useState("");

  const onSubmit = async (data: FormData) => {
    setState("rendering");
    setPct(0);
    // progress is cosmetic but holds at 92% until the server actually answers
    const anim = animate(0, 92, { duration: 2.2, ease: "easeOut", onUpdate: (v) => setPct(Math.round(v)) });
    try {
      // honeypot: real visitors never fill this hidden field; bots do. Pretend success, send nothing.
      if (!data.website) {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
        if (!serviceId || !templateId || !publicKey) throw new Error("EmailJS is not configured");
        const emailjs = (await import("@emailjs/browser")).default;
        // several aliases per value so it works with whatever variable names your EmailJS template uses
        await emailjs.send(
          serviceId,
          templateId,
          {
            name: data.name, from_name: data.name, user_name: data.name,
            email: data.email, from_email: data.email, user_email: data.email, reply_to: data.email,
            type: data.type, project_type: data.type,
            budget: data.budget,
            deadline: data.deadline || "Not specified",
            message: data.message,
            subject: `New project enquiry — ${data.name} (${data.type})`,
            to_name: profile.name,
          },
          { publicKey },
        );
      }
      await anim;
      await new Promise<void>((r) => animate(92, 100, { duration: 0.4, onUpdate: (v) => setPct(Math.round(v)), onComplete: r }));
      setState("done");
      reset();
    } catch (err) {
      anim.stop();
      console.error("[contact] could not send:", err);
      // EmailJS errors carry { status, text }; anything else is a plain Error
      const e = err as { status?: number; text?: string; message?: string };
      setDetail(e?.status ? `EmailJS ${e.status}: ${e.text ?? ""}` : e?.message ?? "Unknown error");
      setState("error");
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <section id="contact" className="section">
      <div className="wrap">
        <p className="label mb-5 flex items-center gap-3"><span className="h-px w-8 bg-amber" />Export</p>
        <SplitText text="Let's make something worth watching." serif={["worth", "watching."]} className="display mb-8 md:mb-14 text-[clamp(2.75rem,8vw,8rem)]" />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="flex flex-col gap-6">
              <p className="max-w-md text-xl text-mist">Got a Reel, TikTok or batch of Shorts to ship? Tell me about it — I usually reply within a day.</p>
              <button onClick={copy} className="glass group flex items-center justify-between rounded-[24px] p-6 text-left" aria-live="polite">
                <span><span className="label mb-2 block">Email</span><span className="text-lg sm:text-2xl">{profile.email}</span></span>
                <span className="label !text-amber">{copied ? "Copied ✓" : "Copy"}</span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass glass-static relative overflow-hidden rounded-[32px] p-6 md:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate aria-busy={state === "rendering"}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5"><span className="label">Name</span><input {...register("name")} className={field} placeholder="Your name" autoComplete="name" /><Err m={errors.name?.message} /></label>
                  <label className="grid gap-1.5"><span className="label">Email</span><input {...register("email")} type="email" className={field} placeholder="you@brand.com" autoComplete="email" /><Err m={errors.email?.message} /></label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5"><span className="label">Project type</span>
                    <select {...register("type")} defaultValue="" className={field}><option value="" disabled>Select…</option>{projectTypes.map((t) => <option key={t} className="bg-ink">{t}</option>)}</select><Err m={errors.type?.message} /></label>
                  <label className="grid gap-1.5"><span className="label">Budget</span>
                    <select {...register("budget")} defaultValue="" className={field}><option value="" disabled>Select…</option>{budgets.map((t) => <option key={t} className="bg-ink">{t}</option>)}</select><Err m={errors.budget?.message} /></label>
                </div>
                <label className="grid gap-1.5"><span className="label">Deadline (optional)</span><input {...register("deadline")} type="date" className={field} /></label>
                <label className="grid gap-1.5"><span className="label">Message</span><textarea {...register("message")} rows={5} className={field} placeholder="What are we making? Links to references help." /><Err m={errors.message?.message} /></label>
                <input {...register("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <Magnetic className="mt-2 justify-self-start" strength={0.2}>
                  <button type="submit" disabled={state === "rendering"} className="rounded-full bg-snow px-8 py-4 font-medium text-void transition-opacity disabled:opacity-60">Export message →</button>
                </Magnetic>
                {state === "error" && (
                  <div role="alert" className="text-sm text-rose">
                    <p>Couldn't send — please email me directly at {profile.email}.</p>
                    {process.env.NODE_ENV !== "production" && detail && <p className="mt-1 font-mono text-xs text-rose/80">[dev only] {detail}</p>}
                  </div>
                )}
              </form>

              <AnimatePresence>
                {(state === "rendering" || state === "done") && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 grid place-items-center bg-ink/90 p-8 backdrop-blur-xl" role="status">
                    <div className="w-full max-w-sm text-center">
                      <p className="label mb-4">{state === "done" ? "Export complete" : "Rendering…"}</p>
                      <p className="display mb-6 text-7xl tabular-nums">{pct}<span className="text-3xl text-fog">%</span></p>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[image:var(--leak)]" style={{ width: `${pct}%` }} /></div>
                      {state === "done" && (
                        <>
                          <p className="serif-i mt-8 text-3xl">Message delivered.</p>
                          <p className="mt-2 text-mist">I'll get back to you soon.</p>
                          <button onClick={() => setState("idle")} className="glass mt-6 rounded-full px-5 py-2.5 text-sm">Send another</button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Err({ m }: { m?: string }) {
  return m ? <span role="alert" className="text-xs text-rose">{m}</span> : null;
}
