import { useEffect, useRef, useState } from "react";
import { createPannellumViewer, type PannellumViewer, type PannellumHotSpot } from "@/lib/panellum";

interface VirtualTourViewerProps {
  imageUrl: string;
  hotspots?: PannellumHotSpot[];
  title?: string;
  subtitle?: string;
  className?: string;
  controlsClassName?: string;
}

const VirtualTourViewer = ({
  imageUrl,
  hotspots = [],
  title,
  subtitle,
  className = "w-full h-[500px] relative",
  controlsClassName = "absolute bottom-0 left-0 right-0 bg-dark/70 text-white p-4",
}: VirtualTourViewerProps) => {
  const viewerContainerId = `pannellum-viewer-${Math.random().toString(36).substr(2, 9)}`;
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoom, setZoom] = useState(75); // Default zoom level (75%)

  useEffect(() => {
    if (!window.pannellum) {
      console.error("Pannellum is not loaded");
      return;
    }

    // Initialize the viewer
    viewerRef.current = createPannellumViewer(viewerContainerId, imageUrl);

    // Add hotspots if provided
    if (hotspots.length > 0 && viewerRef.current) {
      hotspots.forEach((hotspot) => {
        viewerRef.current?.addHotSpot(hotspot);
      });
    }

    const handleLoad = () => {
      setIsLoaded(true);
    };

    // Check if the viewer is loaded
    const checkLoaded = setInterval(() => {
      if (viewerRef.current?.isLoaded()) {
        setIsLoaded(true);
        clearInterval(checkLoaded);
      }
    }, 100);

    return () => {
      clearInterval(checkLoaded);
      // Destroy the viewer when component unmounts
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [imageUrl, viewerContainerId]);

  // Handle zoom in
  const handleZoomIn = () => {
    if (viewerRef.current) {
      const currentHfov = viewerRef.current.getHfov();
      const newHfov = Math.max(currentHfov * 0.9, 30); // Limit minimum zoom
      viewerRef.current.setHfov(newHfov, true);
      setZoom(Math.min(zoom + 10, 100));
    }
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (viewerRef.current) {
      const currentHfov = viewerRef.current.getHfov();
      const newHfov = Math.min(currentHfov * 1.1, 120); // Limit maximum zoom
      viewerRef.current.setHfov(newHfov, true);
      setZoom(Math.max(zoom - 10, 10));
    }
  };

  // Handle information toggle
  const handleInfoToggle = () => {
    // Implement information panel toggle functionality
    console.log("Info toggle clicked");
  };

  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    const container = document.getElementById(viewerContainerId);
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className={className}>
      <div id={viewerContainerId} className="w-full h-full rounded-lg overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      {isLoaded && (
        <div className={controlsClassName}>
          <div className="flex justify-between items-center">
            <div>
              {title && <h4 className="font-heading font-medium text-sm">{title}</h4>}
              {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleZoomIn}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                aria-label="Zoom in"
              >
                <i className="ri-zoom-in-line text-sm"></i>
              </button>
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                aria-label="Zoom out"
              >
                <i className="ri-zoom-out-line text-sm"></i>
              </button>
              <button
                onClick={handleInfoToggle}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                aria-label="Information"
              >
                <i className="ri-information-line text-sm"></i>
              </button>
              <button
                onClick={handleFullscreenToggle}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                aria-label="Fullscreen"
              >
                <i className={`ri-${isFullscreen ? 'fullscreen-exit' : 'fullscreen'}-line text-sm`}></i>
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${zoom}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTourViewer;
