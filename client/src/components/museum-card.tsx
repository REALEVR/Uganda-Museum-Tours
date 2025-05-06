import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Museum } from "@shared/schema";

interface MuseumCardProps {
  museum: Museum;
  onPreviewClick?: () => void;
}

const MuseumCard = ({ museum, onPreviewClick }: MuseumCardProps) => {
  const { id, name, description, imageUrl, duration, price, rating } = museum;
  
  // Format the price from cents to dollars
  const formattedPrice = (price / 100).toFixed(2);
  
  // Format the rating to be out of 5
  const formattedRating = rating ? (rating / 10).toFixed(1) : "N/A";

  return (
    <div className="tour-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
      <div className="relative h-56 overflow-hidden">
        {museum.panellumUrl.includes('realevr.com') ? (
          <div className="w-full h-full">
            <iframe 
              src={museum.panellumUrl} 
              title={name}
              className="w-full h-full border-0"
              allowFullScreen
            ></iframe>
            <div className="absolute top-0 left-0 right-0 bottom-0" onClick={onPreviewClick}></div>
          </div>
        ) : (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="tour-overlay absolute inset-0 bg-primary/70 opacity-0 transition-opacity flex items-center justify-center">
          <Button 
            variant="outline" 
            onClick={onPreviewClick}
            className="px-4 py-2 bg-white text-primary rounded-md font-medium"
          >
            Preview Tour
          </Button>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 py-1 px-3 rounded-full text-sm font-medium">
          ${formattedPrice}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-heading font-bold text-xl mb-2">{name}</h3>
        <p className="text-dark/70 mb-4 text-sm">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="ri-time-line text-primary mr-1"></i>
            <span className="text-xs text-dark/70">{duration} min tour</span>
          </div>
          {rating && (
            <div className="flex items-center">
              <i className="ri-star-fill text-secondary mr-1"></i>
              <span className="text-sm font-medium">{formattedRating}/5</span>
            </div>
          )}
        </div>
        <Link href={`/museum/${id}`}>
          <Button className="mt-4 w-full py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition">
            Start Virtual Tour
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MuseumCard;
