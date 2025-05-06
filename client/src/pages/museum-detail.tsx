import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Museum } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import VirtualTourViewer from "@/components/ui/virtual-tour-viewer";
import { motion } from "framer-motion";

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
  
  // Generate future timestamp for "viewing" the museum from
  const futureYear = 2073;
  
  // Get a list of artifacts for this museum
  const getArtifacts = () => {
    switch(museum.id) {
      case 1: // Ssemagulu Museum
        return [
          { name: "Buganda Kingdom Ceremonial Drums", era: "19th Century", significance: "Used in royal court ceremonies" },
          { name: "Traditional Bark Cloth", era: "Pre-colonial", significance: "Cultural textile of the Baganda people" },
          { name: "Royal Spears and Shields", era: "18th-19th Century", significance: "Symbols of authority and protection" },
          { name: "Ancient Agricultural Tools", era: "Pre-industrial", significance: "Evidence of early farming practices" }
        ];
      case 7: // Museum of Technology
        return [
          { name: "Early Communication Devices", era: "1970s-1990s", significance: "First telephones in Uganda" },
          { name: "Computing Artifacts", era: "1980s-2000s", significance: "Evolution of computer technology" },
          { name: "Energy Generation Tools", era: "20th Century", significance: "Development of power infrastructure" },
          { name: "Medical Technology", era: "1950s-2000s", significance: "Healthcare innovation history" }
        ];
      default:
        return [
          { name: "Cultural Artifacts", era: "Various periods", significance: "Historical items of significance" },
          { name: "Traditional Tools", era: "Pre-colonial to Present", significance: "Evolution of craftsmanship" },
          { name: "Cultural Attire", era: "19th-20th Century", significance: "Traditional dress and accessories" },
          { name: "Artistic Representations", era: "Various periods", significance: "Cultural expression through art" }
        ];
    }
  };
  
  const artifacts = getArtifacts();
  
  return (
    <div className="container mx-auto px-4 py-12 futuristic-section">
      {/* Futuristic header */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.7 }}
        className="mb-8 text-center"
      >
        <div className="time-marker">TIME PORTAL: {futureYear}</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 glow-text">Historical Archives: {museum.name}</h1>
        <p className="text-primary/80">Accessing cultural preservation records from the 21st century</p>
      </motion.div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Images and preview */}
        <div className="w-full lg:w-2/3">
          {showPreview ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <VirtualTourViewer 
                  imageUrl={museum.panellumUrl}
                  title={museum.name}
                  subtitle="Historical Immersion (Limited Access)"
                  className="h-[500px] rounded-lg overflow-hidden shadow-lg glow-border"
                />
                <div className="absolute top-3 left-3 bg-black/70 py-1 px-3 rounded-full text-xs text-white">
                  <span className="text-primary">⦿</span> LIVE RECONSTRUCTION
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-lg overflow-hidden futuristic-card"
            >
              <img 
                src={museum.imageUrl} 
                alt={museum.name} 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="time-marker mb-3">HISTORICAL SITE · CIRCA 2025</div>
                <h2 className="text-white text-2xl font-bold mb-6">{museum.name}</h2>
                <Button 
                  className="px-6 py-3 bg-primary text-white font-medium hover:bg-primary/90 glow-border"
                  onClick={() => setShowPreview(true)}
                >
                  <i className="ri-history-line mr-2"></i> Activate Time Portal
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="mt-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="time-marker mb-1">HISTORICAL RECORDS</div>
              <h2 className="font-heading font-bold text-2xl mb-4">Cultural Significance of {museum.name}</h2>
              <p className="text-dark/80 leading-relaxed mb-6">{museum.description}</p>
              <p className="text-dark/80 leading-relaxed mb-6">
                This virtual preservation allows modern-day viewers to explore authentic Ugandan cultural artifacts as they existed
                in the early 21st century. The interactive temporal viewer enables navigation through the historical site as it once stood,
                preserving the cultural heritage for future generations to experience.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8"
            >
              <div className="time-marker mb-2">ARTIFACT DATABASE</div>
              <h3 className="font-heading font-bold text-xl mb-4">Preserved Cultural Elements</h3>
              
              <div className="space-y-4 mt-6">
                {artifacts.map((artifact, index) => (
                  <div key={index} className="timeline-item">
                    <h4 className="font-bold text-primary">{artifact.name}</h4>
                    <div className="text-sm flex justify-between">
                      <span className="text-dark/70">Era: {artifact.era}</span>
                      <span className="text-primary/80">{artifact.significance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="futuristic-card p-6 rounded-lg"
              >
                <div className="time-marker">PORTAL FEATURES</div>
                <h3 className="font-heading font-bold text-lg mb-3">Temporal Viewing Technology</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>Full 360° temporal reconstruction of historical spaces</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>Artifact information nodes with historical context</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>Cultural preservation data from authentic Ugandan sources</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-success mt-1 mr-2"></i>
                    <span>High-fidelity reconstruction with quantum rendering</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="futuristic-card p-6 rounded-lg"
              >
                <div className="time-marker">PORTAL SPECIFICATIONS</div>
                <h3 className="font-heading font-bold text-lg mb-3">Temporal Access Details</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <i className="ri-time-line text-primary mt-1 mr-2"></i>
                    <span>Estimated temporal immersion: {museum.duration} minutes</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-global-line text-primary mt-1 mr-2"></i>
                    <span>Linguistic adaptation: English translation matrix</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-device-line text-primary mt-1 mr-2"></i>
                    <span>Compatible with all neural and traditional interfaces</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-calendar-line text-primary mt-1 mr-2"></i>
                    <span>Temporal access granted for 30 standard days</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Right column - Temporal Access Portal */}
        <div className="w-full lg:w-1/3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="futuristic-card rounded-lg overflow-hidden sticky top-24"
          >
            <div className="p-6 bg-primary text-white">
              <div className="time-marker text-white/90">TEMPORAL ACCESS PERMIT</div>
              <h2 className="font-heading font-bold text-2xl mb-2">{museum.name}</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="ri-time-line mr-1"></i>
                  <span>{museum.duration} min immersion</span>
                </div>
                {museum.rating && (
                  <div className="flex items-center">
                    <i className="ri-star-fill text-secondary mr-1"></i>
                    <span>Historical Rating: {(museum.rating / 10).toFixed(1)}/5</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="mb-6 relative">
                <div className="time-marker">TEMPORAL CREDIT ALLOCATION</div>
                <div className="text-3xl font-bold text-primary mb-1 glow-text">${formattedPrice}</div>
                <div className="bg-primary/10 px-2 py-1 rounded text-xs inline-block">
                  <i className="ri-history-line mr-1"></i> 30-day access to temporal stream
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 mb-6">
                <h3 className="font-heading font-medium text-lg">Access Privileges:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-primary mt-1 mr-2"></i>
                    <span>Full temporal reconstruction of {museum.name}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-primary mt-1 mr-2"></i>
                    <span>Interactive RealEVR chronometric visualization</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-primary mt-1 mr-2"></i>
                    <span>Complete artifact database with provenance data</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-primary mt-1 mr-2"></i>
                    <span>Cross-device temporal stream synchronization</span>
                  </li>
                </ul>
              </div>
              
              {hasAccess ? (
                <>
                  <div className="border-pulse bg-primary/5 border border-primary/30 rounded-md p-3 mb-6 flex items-center">
                    <i className="ri-shield-check-line text-primary text-xl mr-2"></i>
                    <span className="text-primary font-medium">Temporal Access Already Authorized</span>
                  </div>
                  <Button 
                    onClick={handleStartTour}
                    className="w-full bg-primary text-white font-medium hover:bg-primary/90 py-3 glow-border"
                  >
                    <i className="ri-time-line mr-2"></i> Initiate Temporal Immersion
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleStartTour}
                    className="w-full bg-primary text-white font-medium hover:bg-primary/90 py-3 mb-3 glow-border"
                  >
                    <i className="ri-key-2-line mr-2"></i> Request Temporal Access Key
                  </Button>
                  <div className="text-center text-sm text-dark/70">
                    <i className="ri-shield-keyhole-line mr-1"></i> Quantum-secured transaction protocol
                  </div>
                </>
              )}
              
              <div className="mt-6 text-center p-3 bg-primary/5 rounded-md border border-primary/20">
                <div className="time-marker mb-1">ENHANCED ACCESS OPTION</div>
                <p className="text-sm">
                  Access both pioneering museums in a single temporal stream with our{" "}
                  <Link href="/#pricing">
                    <a className="text-primary hover:underline glow-text">Pioneering Museums Time Key</a>
                  </Link>
                  {" "}at 30% reduced temporal credit allocation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MuseumDetail;
