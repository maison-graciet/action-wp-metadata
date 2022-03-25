import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./save";

registerBlockType( "gco/icon", {
  apiVersion: 2,
  title: "Icône",
  description: "Insérez une icône",
  category: "design",
  icon: "flag",
  keywords: ["icon"],
  supports: {
    html: false,
    reusable: true,
    color: false,
    inserter: false
  },
  attributes: {
    iconName: {
      type: "string",
      default: ""
    },
    iconColor: {
      type: "string",
      default: ""
    },
    tagName: {
      type: "string",
      default: "i"
    }
  },
  edit: Edit,
  save,
} );
