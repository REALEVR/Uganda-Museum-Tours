import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Timer, Star, Info } from 'lucide-react';
import { Link } from 'wouter';
import { PannellumViewer, createPannellumViewer } from '@/lib/panellum';
import { Museum } from '@shared/schema';

const TourView = () => {
  const { t } = useTranslation();
  const [_, params] = useRoute('/tour/:id');
  const museumId = params?.id ? parseInt(params.id) : 0;
  const [viewer, setViewer] = useState<PannellumViewer | null>(null);
  const [isRealEVR, setIsRealEVR] = useState(false);

  // Fetch museum details
  const { data: museum, isLoading } = useQuery<Museum>({
    queryKey: [`/api/museums/${museumId}`],
    enabled: museumId > 0
  });

  useEffect(() => {
    if (museum) {
      // Check if this is a RealEVR tour (for Ssemagulu Museum or Museum of Technology)
      if (museum.id === 1 || museum.id === 7) {
        setIsRealEVR(true);
      } else if (museum.panellumUrl && !isRealEVR) {
        // Initialize Pannellum viewer for other museums
        const viewerId = 'panorama';
        const container = document.getElementById(viewerId);
        
        if (container) {
          const newViewer = createPannellumViewer(viewerId, museum.panellumUrl);
          setViewer(newViewer);
          
          return () => {
            newViewer.destroy();
          };
        }
      }
    }
  }, [museum, isRealEVR]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }

  if (!museum) {
    return (
      <div className="py-16 px-6 text-center">
        <h2 className="text-2xl font-medium mb-4">{t('museumTour.notFound')}</h2>
        <Link href="/museums">
          <a className="tesla-button primary">{t('museumTour.backToMuseums')}</a>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Tour Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left: Back button and Title */}
          <div className="flex items-center">
            <Link href={`/museums/${museum.id}`}>
              <a className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </a>
            </Link>
            <h1 className="text-xl font-medium">
              {museum.name}
            </h1>
          </div>
          
          {/* Right: Tour Info */}
          <div className="flex items-center space-x-5">
            <div className="flex items-center text-sm text-muted-foreground">
              <Timer className="h-4 w-4 mr-1" />
              <span>{museum.duration} {t('museums.minutes')}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{museum.rating ? museum.rating.toFixed(1) : '0.0'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tour Content */}
      <div className="flex-grow">
        {isRealEVR ? (
          // RealEVR iframe for featured museums
          <div className="relative w-full h-[calc(100vh-64px)]">
            <iframe 
              src={museum.panellumUrl} 
              title={museum.name}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        ) : (
          // Pannellum for standard museums
          <div className="relative w-full h-[calc(100vh-64px)]">
            <div id="panorama" className="w-full h-full"></div>
          </div>
        )}
      </div>
      
      {/* Tour Info Panel */}
      <div className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 p-6">
        <div className="container mx-auto">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Info className="h-6 w-6 text-primary" />
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-2">{t('museumTour.aboutThisTour')}</h2>
              <p className="text-muted-foreground">{museum.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourView;