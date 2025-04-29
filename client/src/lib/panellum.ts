// Type definitions for Pannellum
declare global {
  interface Window {
    pannellum: {
      viewer: (id: string, config: PannellumConfig) => PannellumViewer;
    };
  }
}

export interface PannellumConfig {
  type: string;
  panorama: string;
  autoLoad: boolean;
  autoRotate?: number;
  autoRotateInactivityDelay?: number;
  preview?: string;
  showControls?: boolean;
  yaw?: number;
  pitch?: number;
  hfov?: number;
  minHfov?: number;
  maxHfov?: number;
  compass?: boolean;
  northOffset?: number;
  hotSpots?: PannellumHotSpot[];
  hotSpotDebug?: boolean;
}

export interface PannellumHotSpot {
  id: string;
  pitch: number;
  yaw: number;
  text?: string;
  URL?: string;
  cssClass?: string;
  createTooltipFunc?: (hotSpotDiv: HTMLElement, args: any) => void;
  createTooltipArgs?: any;
  clickHandlerFunc?: (e: MouseEvent) => void;
  clickHandlerArgs?: any;
}

export interface PannellumViewer {
  getYaw: () => number;
  setYaw: (yaw: number, animated?: boolean, callback?: () => void, callbackArgs?: any) => void;
  getPitch: () => number;
  setPitch: (pitch: number, animated?: boolean, callback?: () => void, callbackArgs?: any) => void;
  getHfov: () => number;
  setHfov: (hfov: number, animated?: boolean, callback?: () => void, callbackArgs?: any) => void;
  lookAt: (pitch: number, yaw: number, hfov: number, animated?: boolean, callback?: () => void, callbackArgs?: any) => void;
  getNorthOffset: () => number;
  setNorthOffset: (heading: number) => void;
  getHorizonRoll: () => number;
  setHorizonRoll: (roll: number) => void;
  getHorizonPitch: () => number;
  setHorizonPitch: (pitch: number) => void;
  startAutoRotate: (speed?: number, pitch?: number) => void;
  stopAutoRotate: () => void;
  mouseEventToCoords: (event: MouseEvent) => { pitch: number; yaw: number };
  addHotSpot: (hs: PannellumHotSpot, sceneId?: string) => void;
  removeHotSpot: (hotSpotId: string, sceneId?: string) => boolean;
  resize: () => void;
  isLoaded: () => boolean;
  getConfig: () => PannellumConfig;
  getContainer: () => HTMLElement;
  destroy: () => void;
  registerKeyboardCallback: (
    keyCode: string,
    callback: (e: KeyboardEvent) => void,
    callbackArgs?: any
  ) => void;
  removeKeyboardCallback: (keyCode: string) => void;
}

// Initialize a Pannellum viewer
export const createPannellumViewer = (id: string, imageUrl: string): PannellumViewer => {
  const config: PannellumConfig = {
    type: "equirectangular",
    panorama: imageUrl,
    autoLoad: true,
    autoRotate: -2,
    compass: true,
    showControls: true,
  };

  return window.pannellum.viewer(id, config);
};

// Add hotspots to the viewer
export const addHotspots = (viewer: PannellumViewer, hotspots: PannellumHotSpot[]): void => {
  hotspots.forEach(hotspot => {
    viewer.addHotSpot(hotspot);
  });
};

// Export the full Pannellum types
export type { PannellumConfig, PannellumHotSpot, PannellumViewer };
