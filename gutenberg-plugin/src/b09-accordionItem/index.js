import { registerBlockType } from "@wordpress/blocks";
import edit from "./editItem";
import save from "./saveItem";
import blockIcons from "../icons.js";

registerBlockType("gco/accordion-item", {
  apiVersion: 2,
  title: "Elément d'accordéon",
  description: "Bloc de positionnement pour des éléments d'accordéon, afin de diffuser du contenu refermable et générer une FAQ",
  parent: ["gco/accordion"],
  category: "widgets",
  icon: blockIcons.accordionItem,
  keywords: ["accordéon", "faq", "question"],
  supports: {
    html: false,
    reusable: false,
  },
  attributes: {
    defaultOpen: {
      type: "boolean",
      default: false
    },
    title: {
      type: "string",
      default: ""
    },
  },
  edit,
  save
});
