import Link from "next/link";

export const runtime = "edge";

export default function HomePage() {
  return (
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4 max-w-lg w-full mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] text-center">
            Third-Part Vanilla HTML Website
          </h1>
          <div className="w-full max-w-2xl overflow-y-scroll">
             <p>Test 1 : basic button <Link href="/test-button.html">/test-button</Link></p>
             <p>Test 2 : basic button <Link href="/test-advanced.html" >/test-advanced</Link></p>
          </div>
        </div>
      </main>
  );
}
