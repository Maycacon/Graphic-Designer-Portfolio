import { HeroSection } from "@/app/components/hero-section";

export function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <>
      <HeroSection onNavigate={onNavigate} />
    </>
  );
}

export default HomePage;
