import L from "leaflet";
import { config as conf } from "../../../gracietco-gut.config.js";
const config = conf["b16-map"];


const icon = config.marker;

const primaryIcon = new L.divIcon({
  className: "leaflet-icon",
  iconAnchor: null,
  labelAnchor: null,
  iconSize: new L.Point(23, 30),
  html: "<span class=\"text-primary-700\">"+icon+"</span>"
});

const secondaryIcon = new L.divIcon({
  className: "leaflet-icon",
  iconAnchor: null,
  labelAnchor: null,
  iconSize: new L.Point(23, 30),
  html: "<span class=\"text-secondary-100\">"+icon+"</span>"
});

export { primaryIcon, secondaryIcon };
