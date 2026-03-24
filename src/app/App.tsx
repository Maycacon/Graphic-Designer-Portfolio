import { useState, useEffect } from "react";
import { Navbar } from "@/app/components/navbar";
import  HomePage  from "@/app/pages/home-page";
import  PortfolioVideos  from "@/app/pages/portfolio-videos";
import  PortfolioFlyers  from "@/app/pages/portfolio-flyers";
import  PortfolioLeds  from "@/app/pages/portfolio-leds";
import { ContactPage } from "@/app/pages/contact-page";
import { AboutPage } from "@/app/pages/AboutPage";
import { PortfolioGeral } from "@/app/pages/portfolio-geral";
import { AdminPage } from "@/app/pages/admin-page";

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const initial = window.location.hash.replace('#', '');
    if (initial) setCurrentPage(initial);

    const onHashChange = () => {
      const h = window.location.hash.replace('#', '') || 'home';
      setCurrentPage(h);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // update URL hash so page is directly accessible via URL
    try { window.location.hash = page; } catch { /** ignore in SSR */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
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
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
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
