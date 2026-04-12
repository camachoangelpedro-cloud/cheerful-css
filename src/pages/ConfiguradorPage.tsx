import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import IsometricCanvas from '@/components/configurator/IsometricCanvas';
import ModuleCatalog from '@/components/configurator/ModuleCatalog';
import ConfigToolbar from '@/components/configurator/ConfigToolbar';
import ConfigSummary from '@/components/configurator/ConfigSummary';
import ModuleEditPanel from '@/components/configurator/ModuleEditPanel';

export default function ConfiguradorPage() {
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
