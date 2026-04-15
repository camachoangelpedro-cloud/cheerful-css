import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { useCartSync } from '@/hooks/useCartSync';
import { CookieBanner } from '@/components/CookieBanner';

const HomePage               = lazy(() => import('@/pages/HomePage'));
const CatalogoPage           = lazy(() => import('@/pages/CatalogoPage'));
const ProductoPage           = lazy(() => import('@/pages/ProductoPage'));
const ConfiguradorIntroPage  = lazy(() => import('@/pages/ConfiguradorIntroPage'));
const ConfiguradorPage       = lazy(() => import('@/pages/ConfiguradorPage'));
const NosotrosPage           = lazy(() => import('@/pages/NosotrosPage'));
const ContactoPage           = lazy(() => import('@/pages/ContactoPage'));
const PoliticaPrivacidadPage = lazy(() => import('@/pages/PoliticaPrivacidadPage'));
const TerminosPage           = lazy(() => import('@/pages/TerminosPage'));
const EnviosDevolucionesPage = lazy(() => import('@/pages/EnviosDevolucionesPage'));
const NotFoundPage           = lazy(() => import('@/pages/NotFoundPage'));

function AppContent() {
  useCartSync();
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/"                       element={<HomePage />} />
        <Route path="/catalogo"               element={<CatalogoPage />} />
        <Route path="/producto/:handle"       element={<ProductoPage />} />
        <Route path="/configurador"           element={<ConfiguradorIntroPage />} />
        <Route path="/configurador/editor"   element={<ConfiguradorPage />} />
        <Route path="/nosotros"               element={<NosotrosPage />} />
        <Route path="/contacto"               element={<ContactoPage />} />
        <Route path="/politica-privacidad"    element={<PoliticaPrivacidadPage />} />
        <Route path="/terminos"               element={<TerminosPage />} />
        <Route path="/envios-y-devoluciones"  element={<EnviosDevolucionesPage />} />
        <Route path="/envios"                 element={<Navigate to="/envios-y-devoluciones" replace />} />
        <Route path="/devoluciones"           element={<Navigate to="/envios-y-devoluciones" replace />} />
        <Route path="/envios-devoluciones"    element={<Navigate to="/envios-y-devoluciones" replace />} />
        <Route path="*"                       element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <AppContent />
      <CookieBanner />
      <Toaster
        position="top-center"
        toastOptions={{ style: { fontFamily: 'Inter, system-ui, sans-serif' } }}
      />
    </BrowserRouter>
    </HelmetProvider>
  );
}
