import { useState } from "react";
import { Navbar } from "@/app/components/navbar";
import { HomePage } from "@/app/pages/home-page";
import { PortfolioVideos } from "@/app/pages/portfolio-videos";
import { PortfolioFlyers } from "@/app/pages/portfolio-flyers";
import { PortfolioLeds } from "@/app/pages/portfolio-leds";
import { ContactPage } from "@/app/pages/contact-page";
import AboutPage from "./pages/AboutPage";
import PortfolioGeral from "./pages/portfolio-geral";

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'portfolio':
        return <PortfolioGeral onNavigate={handleNavigate} />;
      case 'portfolio-videos':
        return <PortfolioVideos onNavigate={handleNavigate} />;
      case 'portfolio-flyers':
        return <PortfolioFlyers onNavigate={handleNavigate} />;
      case 'portfolio-leds':
        return <PortfolioLeds onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
}
