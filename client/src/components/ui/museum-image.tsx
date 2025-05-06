import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface MuseumImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

const MuseumImage: React.FC<MuseumImageProps> = ({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full flex items-center justify-center bg-muted/50"
}) => {
  const [error, setError] = useState(false);
  
  // Fallback image component
  const FallbackImage = () => (
    <div className={fallbackClassName}>
      <div className="text-center">
        <ImageOff className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">{alt}</p>
      </div>
    </div>
  );

  // Handle image load error
  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
  };

  // If there's an error, show the fallback
  if (error) {
    return <FallbackImage />;
  }

  // Otherwise, try to load the image
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default MuseumImage;