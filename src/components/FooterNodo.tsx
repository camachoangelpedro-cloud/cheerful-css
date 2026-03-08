import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/30 py-16">
      <div className="nodo-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-2xl tracking-tight">
              NODO
            </Link>
            <p className="font-body text-sm text-muted-foreground mt-4 max-w-sm">
              Sistemas modulares de precisión. Diseño colombiano que evoluciona contigo.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="nodo-caption text-foreground mb-4">Explorar</p>
            <ul className="space-y-3">
              <li>
                <Link to="/catalogo" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/#about" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Estudio
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="nodo-caption text-foreground mb-4">Contacto</p>
            <ul className="space-y-3">
              <li>
                <a href="mailto:hola@nodo.co" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                  hola@nodo.co
                </a>
              </li>
              <li>
                <span className="font-body text-sm text-muted-foreground">
                  Bogotá, Colombia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} NODO. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
              Instagram
            </a>
            <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
              Pinterest
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
