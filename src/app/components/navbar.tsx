import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import logoGif from "../assets/img/logo-gif.gif";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início' },
    {
      id: 'portfolio', label: 'Portfólio', submenu: [
        { id: 'portfolio-videos', label: 'Vídeos' },
        { id: 'portfolio-flyers', label: 'Flyers' },
        { id: 'portfolio-leds', label: 'Leds' },
      ]
    },
    { id: 'contact', label: 'Contato' },
    { id: 'about', label: 'Sobre' },

  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-opacity-20 bg backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <motion.button
            onClick={() => handleNavClick('home')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
          >
            <img
              src={logoGif}
              alt="Logo"
              width={80}
              height={80}
              className="object-contain cursor-pointer"
            />
          </motion.button>
          {/* Title */}
          <span className="ml-2 text-white font-bold center font-sans text-xl">
          </span>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                {item.submenu ? (
                  <>
                    <motion.button
                      onClick={() => handleNavClick(item.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="font-semibold text-[#fff6b6] hover:text-[#FEFF4B] transition-colors"
                    >
                      {item.label}
                    </motion.button>

                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg py-2 px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                      {item.submenu.map((subItem) => (
                        <motion.button
                          key={subItem.id}
                          onClick={() => handleNavClick(subItem.id)}
                          whileHover={{ x: 3 }}
                          whileTap={{ x: -3 }}
                          className={`block w-full text-left px-6 py-2 hover:bg-gray-50 transition-colors ${
                            currentPage === subItem.id ? 'text-[#7c3aed] font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {subItem.label}
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.button
                    onClick={() => handleNavClick(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`font-semibold transition-colors ${
                      currentPage === item.id ? 'text-[#FEFF4B]' : 'text-[#fff6b6]'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#fff6b6]"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-[#2d085e]/95 rounded-xl mt-2"
            >
              <div className="py-4 px-4 space-y-2">
                {navItems.map((item) => (
                  <div key={item.id}>
                    {item.submenu ? (
                      <>
                        <div className="font-semibold text-[#fff6b6] px-4 py-2">
                          {item.label}
                        </div>
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavClick(subItem.id)}
                            className={`block w-full text-left px-8 py-2 transition-colors ${
                              currentPage === subItem.id 
                                ? 'text-[#FEFF4B] font-semibold bg-white/10' 
                                : 'text-white/80'
                            }`}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`block w-full text-left px-4 py-2 font-semibold transition-colors ${
                          currentPage === item.id 
                            ? 'text-[#FEFF4B] bg-white/10' 
                            : 'text-[#fff6b6]'
                        }`}
                      >
                        {item.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;
