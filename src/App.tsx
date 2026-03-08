import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import HomePage from '@/pages/HomePage';
import CatalogoPage from '@/pages/CatalogoPage';
import ProductoPage from '@/pages/ProductoPage';
import { useCartSync } from '@/hooks/useCartSync';

function AppContent() {
  useCartSync();
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalogo" element={<CatalogoPage />} />
      <Route path="/producto/:handle" element={<ProductoPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        }}
      />
    </BrowserRouter>
  );
}
