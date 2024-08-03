import Link from "next/link";

export const runtime = "edge";

export default function HomePage() {
  return (
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4 max-w-lg text-center w-full mx-auto ">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Next Js using Zoid
          </h1>
          <p>This website expose 2 Zoid components to the followinng website : <Link href="https://third-part-nextjs-zoid.vercel.app">third-part-nextjs-zoid.vercel.app</Link></p>
        </div>
      </main>
  );
}
