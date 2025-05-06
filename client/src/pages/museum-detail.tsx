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
  
  // Function to create data nodes for VR background visualization
  const renderDataNodes = () => {
    const nodes = [];
    const streams = [];
    const nodeCount = 15;
    
    for (let i = 0; i < nodeCount; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const size = 3 + Math.random() * 4;
      
      nodes.push(
        <div 
          key={`node-${i}`} 
          className="data-node" 
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.3 + Math.random() * 0.7,
            animation: `pulse-glow ${2 + Math.random() * 4}s infinite ${delay}s`
          }}
        />
      );
      
      if (i % 3 === 0) {
        // Create random data streams connecting nodes
        const targetIdx = Math.floor(Math.random() * nodeCount);
        const targetTop = Math.random() * 100;
        const targetLeft = Math.random() * 100;
        const width = Math.sqrt(Math.pow(targetLeft - left, 2) + Math.pow(targetTop - top, 2));
        const angle = Math.atan2(targetTop - top, targetLeft - left) * (180 / Math.PI);
        
        streams.push(
          <div
            key={`stream-${i}`}
            className="data-stream"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${width}%`,
              transform: `rotate(${angle}deg)`,
              animationDelay: `${delay}s`
            }}
          />
        );
      }
    }
    
    return (
      <div className="data-nodes">
        {nodes}
        {streams}
      </div>
    );
  };

  return (
    <div className="clean-background min-h-screen">
      <div className="container mx-auto px-4 py-12 relative">
        {/* Clean, minimal header */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="subtle-accent mb-2">Virtual Museum Tour</div>
          <h1 className="section-title mb-3">{museum.name}</h1>
          <p className="section-subtitle mx-auto text-center">
            Explore Uganda's rich cultural heritage through our immersive virtual tour experience
          </p>
        </motion.div>
      
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Images and preview */}
          <div className="w-full lg:w-2/3">
            {showPreview ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <VirtualTourViewer 
                    imageUrl={museum.panellumUrl}
                    title={museum.name}
                    subtitle="Interactive 360° Tour"
                    className="h-[500px] rounded-2xl overflow-hidden shadow-lg"
                  />
                  <div className="absolute top-4 left-4 bg-black/50 py-1 px-3 rounded-full text-xs text-white">
                    <span className="text-primary mr-1">●</span> Live Preview
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden clean-card"
              >
                <img 
                  src={museum.imageUrl} 
                  alt={museum.name} 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                  <h2 className="text-white text-2xl font-semibold mb-6">{museum.name}</h2>
                  <Button 
                    className="clean-button px-8 py-3"
                    onClick={() => setShowPreview(true)}
                  >
                    <i className="ri-play-circle-line mr-2"></i> Start Virtual Tour
                  </Button>
                </div>
              </motion.div>
            )}
            
            <div className="mt-12">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="subtle-accent mb-2">About This Museum</div>
                <h2 className="text-2xl font-semibold mb-4">Cultural Significance</h2>
                <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                  {museum.description}
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  This virtual tour allows visitors to explore authentic Ugandan cultural artifacts and experience the museum's 
                  architecture and exhibits through an immersive 360° interface. Navigate through the historical site and discover 
                  the rich cultural heritage that continues to influence East African identity.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-12"
              >
                <div className="subtle-accent mb-2">Featured Artifacts</div>
                <h3 className="text-xl font-semibold mb-6">Cultural Elements</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {artifacts.map((artifact, index) => (
                    <div key={index} className="clean-card p-5 hover:shadow-lg transition-all duration-300">
                      <h4 className="font-semibold text-lg mb-2">{artifact.name}</h4>
                      <div className="text-sm text-gray-500 mb-2">Era: {artifact.era}</div>
                      <div className="text-gray-700">{artifact.significance}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <div className="mt-14">
                <div className="subtle-accent mb-2">Experience Features</div>
                <h3 className="text-xl font-semibold mb-8">Tour Technology</h3>
                
                <div className="feature-group">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="feature-item clean-card"
                  >
                    <div className="feature-icon bg-blue-50">
                      <i className="ri-panorama-line text-primary text-xl"></i>
                    </div>
                    <h3>360° Viewing</h3>
                    <p className="text-gray-600">Complete immersive reconstruction of historical spaces</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="feature-item clean-card"
                  >
                    <div className="feature-icon bg-blue-50">
                      <i className="ri-information-line text-primary text-xl"></i>
                    </div>
                    <h3>Artifact Info</h3>
                    <p className="text-gray-600">Interactive information nodes with historical context</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="feature-item clean-card"
                  >
                    <div className="feature-icon bg-blue-50">
                      <i className="ri-global-line text-primary text-xl"></i>
                    </div>
                    <h3>Cultural Content</h3>
                    <p className="text-gray-600">Authentic Ugandan cultural data and narratives</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="feature-item clean-card"
                  >
                    <div className="feature-icon bg-blue-50">
                      <i className="ri-device-line text-primary text-xl"></i>
                    </div>
                    <h3>Cross-Platform</h3>
                    <p className="text-gray-600">Works on all devices with no additional software</p>
                  </motion.div>
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-6 mt-8">
                  <div className="flex items-center mb-3">
                    <i className="ri-time-line text-primary text-xl mr-2"></i>
                    <span className="text-gray-800 font-medium">Tour Duration: Approximately {museum.duration} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-calendar-line text-primary text-xl mr-2"></i>
                    <span className="text-gray-800 font-medium">Access Period: 30 days from purchase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Purchase Section */}
          <div className="w-full lg:w-1/3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="clean-card rounded-2xl overflow-hidden sticky top-24 pb-4"
            >
              <div className="p-8 bg-white">
                <div className="subtle-accent mb-1">Virtual Tour Pass</div>
                <h2 className="text-2xl font-semibold mb-4">{museum.name}</h2>
                
                <div className="flex items-center gap-3 mb-6">
                  {museum.rating && (
                    <div className="bg-blue-50 px-3 py-1 rounded-full text-sm">
                      <span className="text-gray-700">{(museum.rating / 10).toFixed(1)}/5 Rating</span>
                    </div>
                  )}
                  <div className="bg-blue-50 px-3 py-1 rounded-full text-sm">
                    <span className="text-gray-700">{museum.duration} min tour</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="text-3xl font-semibold mb-1">${formattedPrice}</div>
                  <div className="text-gray-500 text-sm">
                    30-day access to virtual tour
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-3 mb-8">
                  <h3 className="font-medium text-lg">Your Tour Includes:</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Full 360° virtual reconstruction of {museum.name}</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Interactive RealEVR visualization technology</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Complete artifact database with historical context</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span>Access on all your devices</span>
                    </li>
                  </ul>
                </div>
                
                {hasAccess ? (
                  <>
                    <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center">
                      <i className="ri-shield-check-line text-primary text-xl mr-2"></i>
                      <span className="text-gray-700 font-medium">You already have access to this tour</span>
                    </div>
                    <Button 
                      onClick={handleStartTour}
                      className="clean-button w-full py-3 text-base"
                    >
                      <i className="ri-play-circle-line mr-2"></i> Start Virtual Tour
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={handleStartTour}
                      className="clean-button w-full py-3 text-base"
                    >
                      <i className="ri-shopping-cart-line mr-2"></i> Buy Virtual Tour
                    </Button>
                    <div className="text-center text-xs text-gray-500 mt-3">
                      Secure payment processing
                    </div>
                  </>
                )}
                
                <div className="mt-8 p-5 bg-blue-50 rounded-xl">
                  <div className="subtitle-accent font-medium mb-2">Save with a Bundle</div>
                  <p className="text-sm text-gray-700 mb-3">
                    Get access to both pioneering museums with our{" "}
                    <Link href="/#pricing">
                      <span className="text-primary hover:underline cursor-pointer font-medium">Pioneering Museums Pass</span>
                    </Link>
                    {" "}and save 30%.
                  </p>
                  <Link href="/#pricing">
                    <Button className="clean-button secondary w-full text-sm">Learn More</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseumDetail;