import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Heading */}
          <h1 className="text-5xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
            Event Management Platform
          </h1>

          {/* Subheading */}
          <p className="text-xl mb-8 leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
            Simple and efficient tools to create, manage, and coordinate your events. Whether you're planning a conference, workshop, or team gathering, we've got you covered.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/book"
              className="p-10 py-3 font-semibold rounded-lg transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--background)",
              }}
            >
              Book Event
            </a>
          </div>
        </div>
      </main>
    </>
  );
}