import Image from "next/image";
import ProjectForm from "@/modules/home/ui/components/project-form";
import ProjectsList from "@/modules/home/ui/components/projects-list";

export default function Home() {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-8 py-[16vh] 2xl:py-48">
        {/* Hero Title */}
        <div className="text-3xl md:text-5xl lg:text-6xl font-bold text-center leading-tight flex flex-col items-center gap-4 animate-fade-in-up">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-gradient">
              Build something amazing
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>with</span>
            <div className="relative group">
              <div className="relative bg-background rounded-2xl p-2 border border-primary/20">
                <Image
                  src="/logo.svg"
                  alt="Vision2Web"
                  width={56}
                  height={56}
                  className="hidden md:block"
                />
                <Image
                  src="/logo.svg"
                  alt="Vision2Web"
                  width={40}
                  height={40}
                  className="md:hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground text-center max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
          Create stunning websites by chatting with AI.{" "}
          <span className="text-foreground font-semibold">
            No coding required.
          </span>
        </p>

        {/* Project Form */}
        <div className="max-w-3xl mx-auto w-full animate-fade-in-up animation-delay-400">
          <ProjectForm />
        </div>
      </section>

      {/* Projects List */}
      <div className="animate-fade-in-up animation-delay-600">
        <ProjectsList />
      </div>
    </div>
  );
}
