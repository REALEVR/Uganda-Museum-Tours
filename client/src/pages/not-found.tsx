import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  const [_, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center py-16">
      <div className="text-center max-w-3xl mx-auto px-6">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-6xl font-medium tracking-tight mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-6">{t('errors.notFound')}</h2>
        
        <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <button 
          onClick={() => navigate("/")}
          className="tesla-button primary mx-auto flex items-center justify-center"
        >
          <Home className="mr-2 h-4 w-4" /> 
          {t('errors.backHome')}
        </button>
      </div>
    </div>
  );
}
