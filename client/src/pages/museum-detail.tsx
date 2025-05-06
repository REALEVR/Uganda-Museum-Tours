import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Museum } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import VirtualTourViewer from "@/components/ui/virtual-tour-viewer";

const MuseumDetail = () => {
  const [match, params] = useRoute("/museum/:id");
  const museumId = params?.id ? parseInt(params.id) : 0;
  const { toast } = useToast();
  const { isAuthenticated, openLoginModal } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  
  // Get museum details
  const { data: museum, isLoading, error } = useQuery<Museum>({
    queryKey: [`/api/museums/${museumId}`],
    enabled: !!museumId,
  });
  
  // Check user access to museum
  const { data: accessData } = useQuery<{ hasAccess: boolean }>({
    queryKey: [`/api/museums/${museumId}/access`],
    enabled: !!museumId && isAuthenticated,
  });
  
  const hasAccess = accessData?.hasAccess || false;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !museum) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Museum</h1>
        <p className="mb-6">Sorry, we couldn't load the museum details. Please try again later.</p>
        <Link href="/museums">
          <Button>Back to Museums</Button>
        </Link>
      </div>
    );
  }
  
  const handleStartTour = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    
    if (hasAccess) {
      window.location.href = `/tour/${museum.id}`;
    } else {
      // Redirect to checkout
      window.location.href = `/checkout/museum/${museum.id}`;
    }
  };
  
  const formattedPrice = (museum.price / 100).toFixed(2);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Images and preview */}
        <div className="w-full lg:w-2/3">
          {showPreview ? (
            <VirtualTourViewer 
              imageUrl={museum.panellumUrl}
              title={museum.name}
              subtitle="Preview Tour (Limited Access)"
              className="h-[500px] rounded-lg overflow-hidden shadow-lg"
            />
          ) : (
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img 
                src={museum.imageUrl} 
                alt={museum.name} 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Button 
                  className="px-6 py-3 bg-primary text-white font-medium hover:bg-primary/90"
                  onClick={() => setShowPreview(true)}
                >
                  <i className="ri-play-circle-line mr-2"></i> Preview Tour
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <h2 className="font-heading font-bold text-2xl mb-4">About {museum.name}</h2>
            <p className="text-dark/80 leading-relaxed mb-6">{museum.description}</p>
            <p className="text-dark/80 leading-relaxed mb-6">
              Step inside this museum virtually and explore authentic Ugandan cultural artifacts through our 
              interactive 360° technology. Navigate through the exhibits at your own pace and discover the 
              stories behind each display from anywhere in the world.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-neutral/30 p-6 rounded-lg">
                <h3 className="font-heading font-bold text-lg mb-3">Virtual Tour Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>Immersive 360° views of all museum areas</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>Click on exhibits for detailed information</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>Learn about authentic Ugandan cultural artifacts</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>High-definition visuals with smooth navigation</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-neutral/30 p-6 rounded-lg">
                <h3 className="font-heading font-bold text-lg mb-3">Virtual Tour Details</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <i className="ri-time-line text-primary mt-1 mr-2"></i>
                    <span>Typical visit time: {museum.duration} minutes</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-global-line text-primary mt-1 mr-2"></i>
                    <span>Tour interface in English</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-device-line text-primary mt-1 mr-2"></i>
                    <span>Works on smartphones, tablets and computers</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-calendar-line text-primary mt-1 mr-2"></i>
                    <span>Unlimited access for 30 days after purchase</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Purchase options */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-24">
            <div className="p-6 bg-primary text-white">
              <h2 className="font-heading font-bold text-2xl mb-2">{museum.name}</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="ri-time-line mr-1"></i>
                  <span>{museum.duration} min tour</span>
                </div>
                {museum.rating && (
                  <div className="flex items-center">
                    <i className="ri-star-fill text-secondary mr-1"></i>
                    <span>{(museum.rating / 10).toFixed(1)}/5</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary mb-1">${formattedPrice}</div>
                <p className="text-dark/70 text-sm">One-time fee for 30 days of unlimited virtual visits</p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 mb-6">
                <h3 className="font-heading font-medium text-lg">What's included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>Complete virtual access to {museum.name}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>Fully interactive RealEVR 3D experience</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>Information about authentic Ugandan artifacts</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>Works on mobile, tablet and desktop devices</span>
                  </li>
                </ul>
              </div>
              
              {hasAccess ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-6 flex items-center">
                    <i className="ri-check-double-line text-success text-xl mr-2"></i>
                    <span className="text-success font-medium">You already have access to this tour</span>
                  </div>
                  <Button 
                    onClick={handleStartTour}
                    className="w-full bg-primary text-white font-medium hover:bg-primary/90 py-3"
                  >
                    Start Full Tour Now
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleStartTour}
                    className="w-full bg-primary text-white font-medium hover:bg-primary/90 py-3 mb-3"
                  >
                    Get Access to Virtual Tour
                  </Button>
                  <div className="text-center text-sm text-dark/70">
                    <i className="ri-lock-line mr-1"></i> Secure payment processing
                  </div>
                </>
              )}
              
              <p className="mt-6 text-center text-sm text-dark/70">
                Want to see both featured museums? Get our{" "}
                <Link href="/#pricing">
                  <a className="text-primary hover:underline">Pioneering Museums Pass</a>
                </Link>
                {" "}for access to Ssemagulu Museum and Museum of Technology at 30% savings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseumDetail;
