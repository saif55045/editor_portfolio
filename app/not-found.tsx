import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6 text-center">
      <div>
        <p className="label mb-6">Clip not found · 00:00:00:00</p>
        <h1 className="display text-[clamp(5rem,20vw,16rem)] text-leak">404</h1>
        <p className="serif-i mt-4 text-3xl text-mist">This frame didn't make the final cut.</p>
        <Link href="/" className="glass mt-10 inline-block rounded-full px-6 py-3">Back to the start</Link>
      </div>
    </main>
  );
}
