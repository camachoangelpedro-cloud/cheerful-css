import { motion } from 'framer-motion';

export function ManifestoSection() {
  return (
    <section id="about" className="py-32 md:py-48">
      <div className="nodo-container">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="nodo-caption text-muted-foreground mb-8">
            Nuestro Manifiesto
          </p>
          
          <h2 className="nodo-heading-lg mb-12">
            No hacemos muebles desechables. Diseñamos sistemas.
          </h2>
          
          <p className="nodo-body text-muted-foreground leading-loose">
            NODO nace en Bogotá con una grilla de 36cm pensada para adaptarse a tu vida, 
            hoy y en diez años. Cada módulo es una decisión consciente: melamina Ecofort 
            de alta densidad, cantos PUR sin químicos visibles, ensamblaje sin herramientas. 
            Directo de nuestra fábrica a tu espacio, sin intermediarios, sin desperdicios.
          </p>
          
          <div className="flex items-center justify-center gap-16 mt-16">
            <div className="text-center">
              <p className="font-display text-3xl mb-2">36cm</p>
              <p className="nodo-caption text-muted-foreground">Grilla Modular</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="font-display text-3xl mb-2">D2C</p>
              <p className="nodo-caption text-muted-foreground">Directo al Cliente</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="font-display text-3xl mb-2">0</p>
              <p className="nodo-caption text-muted-foreground">Herramientas</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
