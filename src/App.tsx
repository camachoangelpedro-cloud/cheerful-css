import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useCartSync } from '@/hooks/useCartSync';

const HomePage        = lazy(() => import('@/pages/HomePage'));
const CatalogoPage    = lazy(() => import('@/pages/CatalogoPage'));
const ProductoPage    = lazy(() => import('@/pages/ProductoPage'));
const ConfiguradorPage = lazy(() => import('@/pages/ConfiguradorPage'));
const ProductoM1Page  = lazy(() => import('@/pages/ProductoM1Page'));
const NosotrosPage              = lazy(() => import('@/pages/NosotrosPage'));
const PoliticaPrivacidadPage    = lazy(() => import('@/pages/PoliticaPrivacidadPage'));
const TerminosPage              = lazy(() => import('@/pages/TerminosPage'));
const EnviosDevolucionesPage    = lazy(() => import('@/pages/EnviosDevolucionesPage'));

function AppContent() {
  useCartSync();
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/catalogo"      element={<CatalogoPage />} />
        <Route path="/producto/:handle" element={<ProductoPage />} />
        <Route path="/configurador"  element={<ConfiguradorPage />} />
        <Route path="/producto/m1-1" element={<ProductoM1Page />} />
        <Route path="/nosotros"              element={<NosotrosPage />} />
        <Route path="/politica-privacidad"   element={<PoliticaPrivacidadPage />} />
        <Route path="/terminos"              element={<TerminosPage />} />
        <Route path="/envios-devoluciones"   element={<EnviosDevolucionesPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Toaster
        position="top-center"
        toastOptions={{ style: { fontFamily: 'Inter, system-ui, sans-serif' } }}
      />
    </BrowserRouter>
  );
}
