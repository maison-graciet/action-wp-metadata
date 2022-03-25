import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./save";

import blockIcons from "../icons.js";
registerBlockType( "gco/accordion", {
  apiVersion: 2,
  title: "Accordéon",
  description: "Bloc de positionnement pour des éléments d'accordéon, afin de diffuser du contenu refermable et générer une FAQ",
  category: "widgets",
  icon: blockIcons.accordion,
  keywords: ["accordéon", "faq", "question"],
  supports: {
    html: false,
  },
  attributes: {
    isFaq: {
      type: "boolean",
      default: false
    },
    isMulti: {
      type: "boolean",
      default: false
    }
  },
  edit: Edit,
  save
});
