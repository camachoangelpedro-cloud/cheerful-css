import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import IsometricCanvas from '@/components/configurator/IsometricCanvas';
import ModuleCatalog from '@/components/configurator/ModuleCatalog';
import ConfigToolbar from '@/components/configurator/ConfigToolbar';
import ConfigSummary from '@/components/configurator/ConfigSummary';

export default function ConfiguradorPage() {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="h-12 border-b border-border flex items-center px-4 gap-4 shrink-0">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body text-xs uppercase tracking-[.12em]">Volver</span>
        </Link>
        <div className="flex-1 text-center">
          <h1 className="font-body text-xs uppercase tracking-[.12em] font-medium">Configurador</h1>
        </div>
        <div className="w-20" /> {/* spacer */}
      </header>

      {/* Main area */}
      <div className="flex-1 flex min-h-0">
        {/* Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          <IsometricCanvas />
          <ConfigToolbar />
        </div>

        {/* Right panel */}
        <div className="flex flex-col">
          <ModuleCatalog />
          <ConfigSummary />
        </div>
      </div>
    </div>
  );
}
