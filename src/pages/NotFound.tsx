import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <p className="font-body text-[10px] uppercase tracking-[.12em] text-muted-foreground mb-4">404</p>
        <h1 className="font-display font-semibold text-3xl mb-4">Página no encontrada</h1>
        <Link to="/" className="font-body text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
