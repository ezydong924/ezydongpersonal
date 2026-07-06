// Minimal shim: @types/leaflet isn't installed, so the Leaflet API surface
// used in this project (map/tileLayer/marker/divIcon/latLngBounds) is
// intentionally untyped here rather than partially/incorrectly typed.
declare module "leaflet" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const L: any;
  export default L;
}
