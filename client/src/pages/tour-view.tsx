import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Museum } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import VirtualTourViewer from "@/components/ui/virtual-tour-viewer";
import { 
  PannellumHotSpot, 
  PannellumViewer 
} from "@/lib/panellum";

const TourView = () => {
  const [match, params] = useRoute("/tour/:id");
  const museumId = params?.id ? parseInt(params.id) : 0;
  const { user, isAuthenticated } = useAuth();
  const [isTourLoaded, setIsTourLoaded] = useState(false);
  const [viewer, setViewer] = useState<PannellumViewer | null>(null);
  
  // Get museum details
  const { data: museum, isLoading: museumLoading } = useQuery<Museum>({
    queryKey: [`/api/museums/${museumId}`],
    enabled: !!museumId,
  });
  
  // Check user access to museum
  const { data: accessData, isLoading: accessLoading } = useQuery<{ hasAccess: boolean }>({
    queryKey: [`/api/museums/${museumId}/access`],
    enabled: !!museumId && isAuthenticated,
  });
  
  const hasAccess = accessData?.hasAccess || false;
  const isLoading = museumLoading || accessLoading;
  
  // Define hotspots for the tour
  const [hotspots, setHotspots] = useState<PannellumHotSpot[]>([]);
  
  useEffect(() => {
    if (museum) {
      // Example hotspots - in a real app, these would come from the backend
      const demoHotspots: PannellumHotSpot[] = [
        {
          id: "info-point-1",
          pitch: -10,
          yaw: 70,
          text: "Artifact information point",
          cssClass: "custom-hotspot",
          clickHandlerFunc: (e) => {
            alert("Information about this artifact: This is a traditional ceremonial mask used in cultural rituals.");
          }
        },
        {
          id: "info-point-2",
          pitch: 0,
          yaw: 170,
          text: "Historical context",
          cssClass: "custom-hotspot",
          clickHandlerFunc: (e) => {
            alert("Historical context: This exhibit showcases artifacts from the 18th century.");
          }
        }
      ];
      
      setHotspots(demoHotspots);
    }
  }, [museum]);
  
  // Handle tour loaded
  const handleTourLoaded = (viewerInstance: PannellumViewer) => {
    setViewer(viewerInstance);
    setIsTourLoaded(true);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!museum) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Museum Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find the museum you're looking for.</p>
        <Link href="/museums">
          <Button>Return to Museums</Button>
        </Link>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-6">Please sign in to access this virtual tour.</p>
        <Link href="/museums">
          <Button>Return to Museums</Button>
        </Link>
      </div>
    );
  }
  
  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Purchase Required</h1>
        <p className="mb-6">You don't have access to this tour. Please purchase to continue.</p>
        <Link href={`/checkout/museum/${museum.id}`}>
          <Button className="bg-primary text-white hover:bg-primary/90 mr-4">
            Purchase Now
          </Button>
        </Link>
        <Link href="/museums">
          <Button variant="outline">Return to Museums</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-black min-h-screen pb-8">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{museum.name}</h1>
            <p className="text-white/70">Virtual Tour Experience</p>
          </div>
          <div className="flex mt-4 md:mt-0">
            <Link href={`/museum/${museum.id}`}>
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                <i className="ri-arrow-left-line mr-2"></i> Back to Details
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Tour Viewer Section */}
        <div className="bg-dark rounded-lg overflow-hidden shadow-xl">
          {museum.panellumUrl.includes('realevr.com') ? (
            <div className="h-[70vh] rounded-lg overflow-hidden relative">
              <iframe 
                src={museum.panellumUrl}
                title={museum.name}
                className="w-full h-full border-0"
                allowFullScreen
              ></iframe>
              <div className="absolute top-4 left-4 bg-dark/70 text-white py-2 px-4 rounded-md">
                <h3 className="font-heading font-bold text-sm">{museum.name}</h3>
                <p className="text-white/70 text-xs">Full Access Tour</p>
              </div>
            </div>
          ) : (
            <VirtualTourViewer 
              imageUrl={museum.panellumUrl}
              hotspots={hotspots}
              title={museum.name}
              subtitle="Full Access Tour"
              className="h-[70vh] rounded-lg overflow-hidden"
            />
          )}
        </div>
        
        {/* Tour Information and Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <h2 className="font-heading font-bold text-xl mb-4">About This Tour</h2>
              <p className="text-dark/80 mb-4">{museum.description}</p>
              <p className="text-dark/80 mb-6">
                Navigate through the tour using your mouse or touch screen. Click and drag to look around, 
                scroll to zoom in and out. Click on hotspots <i className="ri-focus-2-line text-primary"></i> 
                throughout the tour to learn more about specific exhibits and artifacts.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-neutral/30 p-4 rounded-lg text-center">
                  <i className="ri-drag-move-line text-2xl text-primary mb-2"></i>
                  <h3 className="font-medium">Click & Drag</h3>
                  <p className="text-sm text-dark/70">to look around</p>
                </div>
                <div className="bg-neutral/30 p-4 rounded-lg text-center">
                  <i className="ri-zoom-in-line text-2xl text-primary mb-2"></i>
                  <h3 className="font-medium">Scroll</h3>
                  <p className="text-sm text-dark/70">to zoom in/out</p>
                </div>
                <div className="bg-neutral/30 p-4 rounded-lg text-center">
                  <i className="ri-focus-2-line text-2xl text-primary mb-2"></i>
                  <h3 className="font-medium">Click Hotspots</h3>
                  <p className="text-sm text-dark/70">for information</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <div className="bg-neutral p-6 rounded-lg">
                <h3 className="font-heading font-bold text-lg mb-4">Tour Information</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <i className="ri-time-line text-primary mr-3"></i>
                    <span>Duration: {museum.duration} minutes</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-calendar-line text-primary mr-3"></i>
                    <span>Access: 30 days from purchase</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-zoom-in-line text-primary mr-3"></i>
                    <span>360° Panoramic Views</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-information-line text-primary mr-3"></i>
                    <span>Interactive Information Points</span>
                  </li>
                </ul>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Need help?</h4>
                  <p className="text-sm text-dark/70 mb-4">
                    If you're experiencing any technical issues with your tour, please contact our support team.
                  </p>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    <i className="ri-customer-service-line mr-2"></i> Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourView;
