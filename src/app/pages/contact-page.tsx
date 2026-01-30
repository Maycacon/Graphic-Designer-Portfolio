import { motion } from "motion/react";
import { AnimatedShapes } from "@/app/components/animated-shapes";
import { Instagram, Mail, MessageCircle, MapPin, Phone, ArrowLeft } from "lucide-react";

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#2d085e' }}>
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: '#2d085e' }}>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Vamos <span style={{ color: '#fde68a' }}>Conversar</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Estou sempre aberto a novos projetos e colaborações. Entre em contato e vamos criar algo incrível juntos!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 px-6 bg-[#2d085e]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#ffffff' }}>
                Informações de <span style={{ color: '#fde68a' }}>Contato</span>
              </h2>
              
              <div className="space-y-6">
                <motion.div
                  className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#7c3aed' }}>
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:contato@seudominio.com" className="text-gray-600 hover:text-[#7c3aed] transition-colors">
                      contato@seudominio.com
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#7c3aed' }}>
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#7c3aed] transition-colors">
                      +55 (11) 99999-9999
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#7c3aed' }}>
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instagram</h3>
                    <a href="https://www.instagram.com/oxyy_d/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#7c3aed] transition-colors">
                      @oxyy_d
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#7c3aed' }}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Localização</h3>
                    <p className="text-gray-600">
                      Fortaleza,Ceará
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: '#7c3aed' }}>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Pronto para começar?
                </h2>
                <p className="text-white/90 mb-8 text-lg">
                  Entre em contato agora e vamos discutir seu próximo projeto
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-2xl"
                    style={{ backgroundColor: '#fff6b6', color: '#2d085e' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </motion.a>

                  <motion.a
                    href="mailto:contato@seudominio.com"
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold border-2 transition-all duration-300 hover:bg-white/10"
                    style={{ borderColor: '#fff6b6', color: '#fff6b6' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="w-5 h-5" />
                    Email
                  </motion.a>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 text-center"
              >
                <p className="text-gray-600 mb-4">Disponível para freelance</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }} />
                  <span className="text-sm text-gray-500">Geralmente respondo em 24h</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
);
}

export default ContactPage;
