import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Clock, Star, ArrowRight } from 'lucide-react';

interface Museum {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  duration: number;
  price: number;
  rating: number | null;
  featured?: boolean;
  technology?: string;
}

interface MuseumCardProps {
  museum: Museum;
  onPreviewClick?: () => void;
}

const MuseumCard: React.FC<MuseumCardProps> = ({ museum, onPreviewClick }) => {
  const { t } = useTranslation();
  
  return (
    <div className="tesla-card group relative overflow-hidden">
      {/* Image container with overlay */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={museum.imageUrl} 
          alt={museum.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60"></div>
        
        {/* Featured badge */}
        {museum.featured && (
          <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-sm font-medium uppercase tracking-wider">
            Featured
          </div>
        )}
        
        {/* Technology badge */}
        {museum.technology && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-sm font-medium">
            {museum.technology}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{museum.name}</h3>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span>{museum.rating ? museum.rating.toFixed(1) : '0.0'}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {museum.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{museum.duration} {t('museums.minutes')}</span>
          </div>
          
          <div className="text-sm font-medium">
            ${museum.price.toFixed(2)}
          </div>
        </div>
        
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link href={`/museum/${museum.id}`}>
            <a className="tesla-button secondary py-2 px-4 text-xs">
              {t('museums.viewDetails')}
            </a>
          </Link>
          
          {onPreviewClick ? (
            <button 
              onClick={onPreviewClick}
              className="tesla-button primary py-2 px-4 text-xs flex items-center justify-center"
            >
              {t('museumDetail.preview')}
              <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          ) : (
            <Link href={`/tour/${museum.id}`}>
              <a className="tesla-button primary py-2 px-4 text-xs flex items-center justify-center">
                {t('museums.startTour')}
                <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MuseumCard;