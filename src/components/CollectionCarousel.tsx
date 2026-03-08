import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CollectionCarouselProps {
  title: string;
  description: string;
  images: string[];
  link: string;
}

export function CollectionCarousel({ title, description, images, link }: CollectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 lg:py-24 relative">
      {/* Carousel */}
      <div className="relative">
        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 lg:px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, idx) => (
            <Link 
              key={idx}
              to={link}
              className="relative flex-none w-[75vw] lg:w-[40vw] aspect-[4/5] snap-start group"
            >
              <img 
                src={img}
                alt={`${title} ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-black px-4 py-2 text-sm font-body tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Title & Description - Below carousel */}
      <motion.div 
        className="mt-8 px-6 lg:px-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Link to={link} className="group">
          <h3 className="font-display text-2xl lg:text-3xl mb-3 group-hover:opacity-70 transition-opacity">
            {title}
          </h3>
          <p className="font-body text-sm lg:text-base text-muted-foreground max-w-xl mb-4">
            {description}
          </p>
          <span className="inline-block font-body text-sm tracking-wide underline underline-offset-4">
            Shop
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
