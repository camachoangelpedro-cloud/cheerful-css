import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    image: '/banner1.webp',
    title: 'Diseña el espacio que siempre quisiste',
    subtitle: 'Módulos que llegan armados. Tú solo los conectas.',
    link: '/configurador',
    cta: 'Empieza a diseñar'
  },
  {
    image: '/banner2.webp',
    title: 'Diseña el espacio que siempre quisiste',
    subtitle: 'Módulos que llegan armados. Tú solo los conectas.',
    link: '/configurador',
    cta: 'Empieza a diseñar'
  },
  {
    image: '/banner3.webp',
    title: 'Diseña el espacio que siempre quisiste',
    subtitle: 'Módulos que llegan armados. Tú solo los conectas.',
    link: '/configurador',
    cta: 'Empieza a diseñar'
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={heroSlides[currentSlide].image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/[0.04]" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay - Bottom Left (Kismas style) */}
      <div className="absolute bottom-12 left-8 lg:left-16 z-10">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white"
        >
          <p className="font-body text-sm tracking-wide mb-3 opacity-80">
            {heroSlides[currentSlide].subtitle}
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-light mb-6 max-w-lg leading-tight">
            {heroSlides[currentSlide].title}
          </h2>
          <div className="flex items-center gap-5">
            <Link
              to={heroSlides[currentSlide].link}
              className="inline-block rounded-full px-10 py-4 text-base font-medium tracking-wide transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#1C1C1A', color: '#FFFFFF' }}
            >
              {heroSlides[currentSlide].cta}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 right-8 lg:right-16 z-10 flex gap-2">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'bg-white w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
