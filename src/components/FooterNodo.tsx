import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 lg:py-24">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl tracking-[0.2em] font-extrabold" style={{fontFamily: 'Syne, sans-serif'}}>
              NODO
            </Link>
            <p className="font-body text-sm text-background/60 mt-4 max-w-sm leading-relaxed">
              Sistemas modulares de precisión. Diseño colombiano que evoluciona contigo.
              Fabricación directa, sin intermediarios.
            </p>
            
            {/* Newsletter */}
            <div className="mt-8">
              <p className="font-body text-sm mb-3">Suscríbete a nuestro newsletter</p>
              <div className="flex gap-2">
                <input 
                  type="email"
                  placeholder="E-mail"
                  className="bg-transparent border border-background/30 px-4 py-2.5 text-sm font-body flex-1 focus:outline-none focus:border-background/60 placeholder:text-background/40"
                />
                <button className="border border-background/30 px-6 py-2.5 text-sm font-body hover:bg-background hover:text-foreground transition-colors">
                  Suscribir
                </button>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="font-body text-xs tracking-wider uppercase mb-4 text-background/60">
              Tienda
            </p>
            <ul className="space-y-3">
              <li>
                <Link to="/catalogo" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Shop all
                </Link>
              </li>
              <li>
                <Link to="/catalogo?type=sistemas" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Sistemas
                </Link>
              </li>
              <li>
                <Link to="/catalogo?type=modulos" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Módulos
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="font-body text-xs tracking-wider uppercase mb-4 text-background/60">
              Información
            </p>
            <ul className="space-y-3">
              <li>
                <Link to="/#manifesto" className="font-body text-sm hover:opacity-60 transition-opacity">
                  About
                </Link>
              </li>
              <li>
                <a href="mailto:hola@nodo.co" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Contacto
                </a>
              </li>
              <li>
                <Link to="/shipping" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Envíos
                </Link>
              </li>
              <li>
                <Link to="/returns" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Devoluciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 mt-16 pt-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-background/40">
            © {new Date().getFullYear()} NODO. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-body text-xs text-background/60 hover:text-background transition-colors">
              Instagram
            </a>
            <a href="#" className="font-body text-xs text-background/60 hover:text-background transition-colors">
              Pinterest
            </a>
            <span className="font-body text-xs text-background/40">
              Bogotá, Colombia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
