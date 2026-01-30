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
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8 }}
          >
            <img
              src={logoGif}
              alt="Logo"
              className="w-20 h-20 object-contain cursor-pointer"
            />
          </motion.button>
          {/* Title */}
          <span className="ml-2 text-white font-bold center font-sans text-xl">
            teste
          </span>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                {item.submenu ? (
                  <>


                    <button className="font-semibold text-[#fff6b6] hover:text-[#FEFF4B]transition-colors">

                      <motion.button
                        onClick={() => handleNavClick('portfolio')}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.95 }}
                      >

                        {item.label}
                      </motion.button>
                    </button>


                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                      {item.submenu.map((subItem) => (

                        <button
                          key={subItem.id}
                          onClick={() => handleNavClick(subItem.id)}
                          className={`block w-full text-left px-6 py-2 hover:bg-gray-50 transition-colors ${currentPage === subItem.id ? 'text-[#7c3aed] font-semibold' : 'text-gray-700'
                            }`}
                        >
                          <motion.button
                            onClick={() => handleNavClick('home')}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {subItem.label}
                          </motion.button>
                        </button>

                      ))}
                    </div>
                  </>
                ) : (

                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`font-semibold transition-colors ${currentPage === item.id ? 'text-[#fff6b6]' : 'text-[#fff6b6]'
                      }`}
                  >
                    <motion.button
                      onClick={() => handleNavClick('home')}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.button>
                  </button>

                )
                }
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            style={{ color: '#7c3aed' }}
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
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <div key={item.id}>
                    {item.submenu ? (
                      <>
                        <div className="font-semibold text-gray-700 px-4 py-2">
                          {item.label}
                        </div>
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavClick(subItem.id)}
                            className={`block w-full text-left px-8 py-2 transition-colors ${currentPage === subItem.id ? 'text-[#7c3aed] font-semibold bg-gray-50' : 'text-gray-600'
                              }`}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`block w-full text-left px-4 py-2 font-semibold transition-colors ${currentPage === item.id ? 'text-[#7c3aed] bg-gray-50' : 'text-gray-700'
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
