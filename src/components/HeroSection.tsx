import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const heroSlides = [
  {
    image: '/banner1.webp',
    title: 'Diseña el espacio\nque siempre\nquisiste.',
    overline: 'Sistema Modular · Bogotá',
    link: '/configurador',
    cta: 'Empieza a diseñar',
  },
  {
    image: '/banner2.webp',
    title: 'Modular.\nPreciso.\nTuyo.',
    overline: 'Nueva Colección',
    link: '/catalogo',
    cta: 'Ver colección',
  },
  {
    image: '/banner3.webp',
    title: 'Hecho en Bogotá\npara cualquier\nespacio.',
    overline: 'Fabricación Directa',
    link: '/nosotros',
    cta: 'Nuestra filosofía',
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden">

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img
            src={heroSlides[currentSlide].image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/25" />
        </motion.div>
      </AnimatePresence>

      {/* Content — bottom left */}
      <div className="absolute bottom-12 left-8 lg:left-16 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <p
              className="text-white/50 font-medium uppercase mb-5"
              style={{ fontSize: '11px', letterSpacing: '0.18em' }}
            >
              {heroSlides[currentSlide].overline}
            </p>

            <h1
              className="text-white font-light whitespace-pre-line mb-8"
              style={{
                fontSize: 'clamp(2.6rem, 4.8vw, 5rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.01em',
              }}
            >
              {heroSlides[currentSlide].title}
            </h1>

            <Link
              to={heroSlides[currentSlide].link}
              className="inline-flex items-center gap-3 text-white font-medium uppercase transition-all duration-300 group"
              style={{ fontSize: '11px', letterSpacing: '0.15em' }}
            >
              {heroSlides[currentSlide].cta}
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Counter + prev/next — bottom right */}
      <div className="absolute bottom-12 right-8 lg:right-16 z-10 flex items-center gap-5">
        <button
          onClick={prevSlide}
          className="text-white/40 hover:text-white transition-colors"
          style={{ fontSize: '15px' }}
          aria-label="Anterior"
        >
          ←
        </button>
        <span className="text-white/50" style={{ fontSize: '11px', letterSpacing: '0.18em' }}>
          {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
        </span>
        <button
          onClick={nextSlide}
          className="text-white/40 hover:text-white transition-colors"
          style={{ fontSize: '15px' }}
          aria-label="Siguiente"
        >
          →
        </button>
      </div>

    </section>
  );
}
