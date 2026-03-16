import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { lazy } from 'react';

const ProductViewer3D = lazy(() => import('@/components/ProductViewer3D'));

export function ProductSpotlight() {
  return (
    <section id="producto-destacado">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
            <div className="flex items-center justify-center bg-muted/20 min-h-[500px]">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
            <div className="flex flex-col justify-center px-8 lg:px-16 py-16">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted w-1/3" />
                <div className="h-4 bg-muted w-2/3" />
                <div className="h-4 bg-muted w-1/2" />
              </div>
            </div>
          </div>
        }
      >
        <ProductViewer3D />
      </Suspense>
    </section>
  );
}
