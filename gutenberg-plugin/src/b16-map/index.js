import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import save from "./save";
import blockIcons from "../icons.js";

registerBlockType( "gco/map", {
  apiVersion: 2,
  title: __( "Carte (France)", "gracietco-gut" ),
  description: "Intégrez une carte des filiales",
  category: "widgets",
  icon: blockIcons.map,
  keywords: ["carte", "géolocalisation"],
  supports: {
    html: false,
  },
  attributes: {
    acf: {
      type: "array",
      default: [],
    },
    allBranches: {
      type: "boolean",
      default: false
    },
    linkText: {
      type: "string",
      default: "Découvrir",
    },
    linkAnchor: {
      type: "string",
      default: "",
    },
    asideTitle: {
      type: "string",
      default: "Nous contacter",
    },
    branchShown: {
      type: "int",
      default: -1,
    },
    hasCTA: {
      type: "boolean",
      default: false,
    },
    allInfo: {
      type: "boolean",
      default: true,
    },
    showMail: {
      type: "boolean",
      default: false,
    },
    showPhone: {
      type: "boolean",
      default: false,
    },
    showLink: {
      type: "boolean",
      default: false,
    },
    showAddress: {
      type: "boolean",
      default: false,
    },
    tileServer: {
      type: "string",
      default: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    tileAttribution: {
      type: "string",
      default: "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors"
    }
  },
  edit: Edit,
  save,
} );
