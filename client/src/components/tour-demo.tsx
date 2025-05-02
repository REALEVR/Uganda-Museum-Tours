import { useState } from "react";
import { Button } from "@/components/ui/button";
import VirtualTourViewer from "@/components/ui/virtual-tour-viewer";

const TourDemo = () => {
  const [showDemo, setShowDemo] = useState(false);
  
  const handleWatchDemo = () => {
    setShowDemo(true);
  };

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="w-full lg:w-1/2">
          <h2 className="font-heading font-bold text-3xl mb-4">Experience Interactive Virtual Tours</h2>
          <p className="text-primary/80 mb-6">
            Our virtual tours offer a fully immersive experience with 360° panoramic views, interactive exhibits, and detailed information about artifacts and cultural significance.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <i className="ri-check-line text-success mt-1 mr-2"></i>
              <span>High-resolution imagery of museum exhibits</span>
            </li>
            <li className="flex items-start">
              <i className="ri-check-line text-success mt-1 mr-2"></i>
              <span>Zoom in to examine artifacts in detail</span>
            </li>
            <li className="flex items-start">
              <i className="ri-check-line text-success mt-1 mr-2"></i>
              <span>Audio narration by expert cultural guides</span>
            </li>
            <li className="flex items-start">
              <i className="ri-check-line text-success mt-1 mr-2"></i>
              <span>Interactive hotspots with additional information</span>
            </li>
            <li className="flex items-start">
              <i className="ri-check-line text-success mt-1 mr-2"></i>
              <span>Available on all devices - mobile, tablet and desktop</span>
            </li>
          </ul>
          <Button 
            onClick={handleWatchDemo}
            className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition flex items-center"
          >
            <i className="ri-play-circle-line mr-2"></i> Watch Demo Tour
          </Button>
        </div>
        <div className="w-full lg:w-1/2">
          {showDemo ? (
            <VirtualTourViewer 
              imageUrl="https://pannellum.org/images/alma.jpg"
              title="Uganda National Museum"
              subtitle="Historical Artifacts Section"
              className="h-[400px] rounded-lg overflow-hidden shadow-xl"
            />
          ) : (
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1374&auto=format&fit=crop" 
                alt="Virtual museum tour interface" 
                className="w-full rounded-lg"
              />
              <div className="absolute inset-0 bg-dark/40 flex items-center justify-center">
                <Button 
                  onClick={handleWatchDemo}
                  className="w-16 h-16 bg-primary rounded-full flex items-center justify-center"
                  aria-label="Play demo video"
                >
                  <i className="ri-play-fill text-white text-2xl"></i>
                </Button>
              </div>
              
              {/* Demo Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-dark/70 text-white p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-heading font-medium text-sm">Uganda National Museum</h4>
                    <p className="text-white/70 text-xs">Historical Artifacts Section</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                      <i className="ri-zoom-in-line text-sm"></i>
                    </button>
                    <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                      <i className="ri-information-line text-sm"></i>
                    </button>
                    <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                      <i className="ri-fullscreen-line text-sm"></i>
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TourDemo;
