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
    overline: 'Configurador 3D',
    link: '/configurador',
    cta: 'Diseña tú mismo',
  },
  {
    image: '/banner3.webp',
    title: 'Hecho en Bogotá\npara cualquier\nespacio.',
    overline: 'Fabricación directa',
    link: '/configurador',
    cta: 'Diseña tú mismo',
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

      {/* All slides always rendered — crossfade via CSS opacity */}
      {heroSlides.map((slide, idx) => (
        <div
          key={slide.image}
          className="absolute inset-0"
          style={{
            opacity: idx === currentSlide ? 1 : 0,
            transition: 'opacity 2s ease-in-out',
            zIndex: idx === currentSlide ? 1 : 0,
          }}
        >
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: idx === 1 ? 'center center' : 'center 62%' }}
          />
          <div className="absolute inset-0 bg-black/15" />
        </div>
      ))}

      {/* Content — bottom left on mobile, lower-third on desktop */}
      <div className="absolute bottom-14 lg:bottom-[22%] left-8 lg:left-16 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${currentSlide}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.55, delay: 0.4 }}
          >
            <p
              className="text-white/50 font-medium uppercase mb-5"
              style={{ fontSize: '11px', letterSpacing: '0.18em' }}
            >
              {heroSlides[currentSlide].overline}
            </p>

            <h1
              className="text-white whitespace-pre-line mb-8 nodo-display-italic"
              style={{ fontSize: 'clamp(3rem, 6.5vw, 7.5rem)' }}
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
      <div className="absolute bottom-14 lg:bottom-[22%] right-8 lg:right-16 z-10 flex items-center gap-5">
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
