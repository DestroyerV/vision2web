import Navbar from "@/modules/home/ui/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <Navbar />
      <div className="flex-1 flex flex-col px-4 pb-4">{children}</div>
    </main>
  );
}
