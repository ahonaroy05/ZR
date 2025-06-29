// Type definitions for Leaflet integration
declare module 'leaflet' {
  interface Icon {
    Default: {
      prototype: any;
      mergeOptions: (options: any) => void;
    };
  }
}

declare module 'react-leaflet' {
  export const MapContainer: any;
  export const TileLayer: any;
  export const Marker: any;
  export const Circle: any;
  export const Popup: any;
}