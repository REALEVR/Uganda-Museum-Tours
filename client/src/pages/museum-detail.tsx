import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Clock, Star, ArrowRight, DollarSign, Play } from 'lucide-react';
import MuseumImage from '@/components/ui/museum-image';
import { Museum } from '@shared/schema';

const MuseumDetail = () => {
  const { t } = useTranslation();
  const [_, params] = useRoute('/museums/:id');
  const museumId = params?.id ? parseInt(params.id) : 0;
  const [showPreview, setShowPreview] = useState(false);
  
  // Fetch museum details
  const { data: museum, isLoading } = useQuery<Museum>({
    queryKey: [`/api/museums/${museumId}`],
    enabled: museumId > 0
  });

  // Toggle preview mode
  const handlePreviewClick = () => {
    setShowPreview(!showPreview);
  };

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
        <h2 className="text-2xl font-medium mb-4">{t('museumDetail.notFound')}</h2>
        <Link href="/museums">
          <a className="tesla-button primary">{t('museumDetail.backToMuseums')}</a>
        </Link>
      </div>
    );
  }

  // Check if this is a featured museum (with RealEVR technology)
  const isRealEVR = museum.id === 1 || museum.id === 7;
  
  return (
    <div className="py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/museums">
            <a className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('museumDetail.backToMuseums')}
            </a>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Column: Main Image */}
          <div className="order-2 md:order-1">
            <div className="relative rounded-xl overflow-hidden">
              {showPreview ? (
                // Preview iframe
                <div className="relative aspect-[4/3] w-full">
                  <iframe 
                    src={museum.panellumUrl} 
                    title={museum.name}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                  
                  <button
                    onClick={handlePreviewClick}
                    className="absolute top-0 right-0 m-4 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full"
                    aria-label="Close preview"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                // Main image
                <div className="aspect-[4/3] w-full">
                  <MuseumImage
                    src={museum.imageUrl}
                    alt={museum.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Preview button */}
                  <button
                    onClick={handlePreviewClick}
                    className="absolute bottom-4 right-4 flex items-center gap-2 py-2 px-4 bg-black/70 hover:bg-black/90 text-white rounded-md font-medium"
                  >
                    <Play className="h-4 w-4" />
                    {t('museumDetail.preview')}
                  </button>
                </div>
              )}
            </div>
            
            {/* Technology label */}
            {isRealEVR && (
              <div className="mt-4 inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium">
                RealEVR Technology
              </div>
            )}
          </div>
          
          {/* Right Column: Museum Info */}
          <div className="order-1 md:order-2 flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-medium mb-4">{museum.name}</h1>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="font-medium">{museum.rating ? museum.rating.toFixed(1) : '0.0'}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-5 w-5 mr-1" />
                <span>{museum.duration} {t('museums.minutes')}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="h-5 w-5 mr-1" />
                <span>${museum.price.toFixed(2)}</span>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {museum.description}
            </p>
            
            {/* Call to action */}
            <div className="mt-auto">
              <Link href={`/tour/${museum.id}`}>
                <a className="tesla-button primary flex items-center justify-center">
                  {t('museumDetail.startTour')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Link>
              
              <p className="text-sm text-muted-foreground mt-4 text-center">
                {t('museumDetail.callToAction')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseumDetail;