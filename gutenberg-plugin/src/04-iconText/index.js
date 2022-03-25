import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./save";

registerBlockType( "gco/icon-and-text", {
  apiVersion: 2,
  title: "Icône et texte",
  description: "Utilisez une icône ou une image pour illustrer votre message.",
  category: "design",
  icon: "flag",
  keywords: ["icon"],
  parent: ["gco/locked-group-icon-grid"],
  supports: {
    html: false,
    reusable: true,
    color: false,
    inserter: true
  },
  attributes: {
    hasImage: {
      type: "boolean",
      default: false
    }
  },
  edit: Edit,
  save,
} );
