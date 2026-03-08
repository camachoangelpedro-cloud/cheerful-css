import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function ProductSpotlight() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
      {/* Left: Video/Image */}
      <div className="relative aspect-square lg:aspect-auto overflow-hidden bg-muted/20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80"
        >
          {/* Add video source here if available */}
        </video>
        <img 
          src="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80"
          alt="Sistema Modular"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <Link 
          to="/catalogo"
          className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-black px-5 py-2.5 text-sm font-body tracking-wide hover:bg-white transition-colors"
        >
          Shop
        </Link>
      </div>

      {/* Right: Description */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-3xl lg:text-4xl mb-6">
            Sistema Consola TV
          </h2>
          <p className="font-body text-base lg:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
            Mueble modular de estilo industrial-minimalista en aluminio, 
            que puede colocarse vertical u horizontalmente. Su panel 
            texturizado semitransparente suaviza las siluetas y colores 
            de los objetos en su interior, creando un efecto visual intrigante.
          </p>
          <Link 
            to="/catalogo"
            className="inline-block bg-foreground text-background px-8 py-3 text-sm font-body tracking-wide hover:opacity-90 transition-opacity"
          >
            Shop
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
