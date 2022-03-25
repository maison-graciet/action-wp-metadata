import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./save";
import blockIcons from "../icons.js";

registerBlockType( "gco/coordinate", {
  apiVersion: 2,
  title: "Information de contact",
  description: "Saisissez des coordonnées",
  parent: [ "gco/locked-group-coordinates" ], 
  category: "widgets",
  icon: blockIcons.coords,
  keywords: ["contact", "adresse", "coordonnées"],
  supports: {
    html: false,
  },
  attributes: {
    content: {
      type: "string",
      default: ""
    },
    contentType: {
      type: "string",
      default: "a+tel:"
    }
  },
  edit: Edit,
  save,
} );
