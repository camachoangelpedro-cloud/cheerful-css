import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Monitor } from 'lucide-react';
import IsometricCanvas from '@/components/configurator/IsometricCanvas';
import ModuleCatalog from '@/components/configurator/ModuleCatalog';
import ConfigToolbar from '@/components/configurator/ConfigToolbar';
import ConfigSummary from '@/components/configurator/ConfigSummary';
import ModuleEditPanel from '@/components/configurator/ModuleEditPanel';

export default function ConfiguradorPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <Monitor className="w-16 h-16 mb-6 text-muted-foreground" />
        <h1 className="font-display text-2xl font-light mb-4">
          El configurador 3D está disponible en escritorio
        </h1>
        <p className="text-muted-foreground text-sm mb-8 max-w-md">
          Para diseñar tu sistema NODO con nuestro configurador interactivo, visítanos desde un ordenador. También puedes explorar y comprar módulos individuales desde tu celular.
        </p>
        <a
          href="/catalogo"
          className="rounded-full bg-foreground text-background px-8 py-3.5 text-sm tracking-wide hover:opacity-85 transition-opacity"
        >
          Explorar nuestros muebles
        </a>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <Helmet>
        <title>Configurador 3D — Diseña tu sistema | NODO</title>
        <meta name="description" content="Diseña tu sistema de estantería modular en nuestro configurador 3D. Arrastra módulos, elige colores y visualiza tu proyecto en tiempo real." />
      </Helmet>
      {/* Header */}
      <header className="h-12 border-b border-border flex items-center px-4 gap-4 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body text-[10px] uppercase tracking-[.12em]">Volver</span>
        </Link>
        <div className="flex-1 text-center">
          <h1 className="font-body text-[10px] uppercase tracking-[.12em] font-medium">
            Configurador
          </h1>
        </div>
      </header>

      {/* Canvas + catalog */}
      <div className="flex-1 flex min-h-0">
        {/* Canvas + toolbar */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <IsometricCanvas />
          <ConfigToolbar />
          <ModuleEditPanel />
        </div>

        {/* Right panel: catalog + summary */}
        <div className="flex flex-col border-l border-border min-h-0">
          <div className="flex-1 overflow-y-auto min-h-0">
            <ModuleCatalog />
          </div>
          <ConfigSummary />
        </div>
      </div>
    </div>
  );
}
