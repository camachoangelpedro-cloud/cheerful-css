import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-foreground/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <motion.h1 
          className="nodo-heading-xl text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          DISEÑO QUE EVOLUCIONA CONTIGO.
        </motion.h1>
        
        <motion.p 
          className="font-body text-base md:text-lg text-white/80 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          Sistemas modulares de precisión. Ingeniería colombiana.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          <Link 
            to="/catalogo"
            className="inline-block border border-white/50 text-white px-10 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-foreground transition-all duration-300"
          >
            Explorar la Colección
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-px h-16 bg-white/30" />
      </motion.div>
    </section>
  );
}
