import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import WallSetup from '@/components/configurator/WallSetup';
import IsometricCanvas from '@/components/configurator/IsometricCanvas';
import ModuleCatalog from '@/components/configurator/ModuleCatalog';
import ConfigToolbar from '@/components/configurator/ConfigToolbar';
import ConfigSummary from '@/components/configurator/ConfigSummary';

export default function ConfiguradorPage() {
  const step = useConfiguratorStore(s => s.step);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
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
            {step === 2 && <span className="text-muted-foreground"> — Diseño</span>}
          </h1>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {[1, 2].map(s => (
            <div
              key={s}
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{ background: s <= step ? '#1A2B3C' : 'rgba(0,0,0,0.15)' }}
            />
          ))}
        </div>
      </header>

      {/* Step 1 — wall setup */}
      {step === 1 && <WallSetup />}

      {/* Step 2 — canvas + catalog */}
      {step === 2 && (
        <div className="flex-1 flex min-h-0">
          {/* Canvas + toolbar */}
          <div className="flex-1 flex flex-col min-w-0">
            <IsometricCanvas />
            <ConfigToolbar />
          </div>

          {/* Right panel: catalog + summary */}
          <div className="flex flex-col border-l border-border min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <ModuleCatalog />
            </div>
            <ConfigSummary />
          </div>
        </div>
      )}
    </div>
  );
}
