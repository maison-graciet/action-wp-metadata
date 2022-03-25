import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./save";
import { variations as variationsConfig } from "../../../gracietco-gut.config.js";
import blockIcons from "../icons.js";

const tab = ["gco/locked-group-tab", {}];
const quote = ["core/quote", {
  value: "<p>Vivamus leo. Ut in risus volutpat libero pharetra tempor. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Vivamus leo.</p>",
  citation: "Jean-Michel LeClient<br><strong>Commercial</strong><br><strong>Entreprise SAS</strong>"
}];

const variations = [
  {
    icon: blockIcons.gridContent,
    name: "icon-grid",
    title: "Grille d'icônes",
    description: "Présentez sous la forme d'une grille structurée un ensemble d'icônes ou d'images. Utile pour présenter une liste de logos ou illustrer des mots-clés.",
    category: "layout",
    attributes: {
      tagName: "div",
      variation: "icon-grid",
      orientation: "horizontal",
      allowedBlocks: ["gco/icon-and-text"],
      template: [["gco/icon-and-text", {}],["gco/icon-and-text", {}],["gco/icon-and-text", {}]],
      templateLock: false
    },
  },
  {
    icon: blockIcons.testimonial,
    name: "testimonial-block",
    title: "Zone de témoignages",
    description: "Bloc de positionnement de témoignages",
    category: "widgets",
    attributes: {
      tagName: "div",
      variation: "testimonial-block",
      orientation: "horizontal",
      allowedBlocks: ["core/quote"],
      template: [quote, quote, quote],
      templateLock: false
    },
  },
  {
    icon: blockIcons.tabs,
    name: "tabs",
    title: "Liste d'onglets",
    description: "Bloc de diffusion d'onglets permettant d'afficher plusieurs contenus de manière différée.",
    category: "widgets",
    attributes: {
      tagName: "div",
      variation: "tabs",
      orientation: "horizontal",
      allowedBlocks: ["gco/locked-group-tab"],
      template: [tab, tab, tab],
      templateLock: false,
    },
  },
  {
    icon: blockIcons.coords,
    name: "coordinates",
    title: "Coordonnées",
    description: "Affichez vos coordonnées afin de pouvoir être contacté",
    keywords: ["contact", "adresse", "coordonnées"],
    category: "widgets",
    attributes: {
      tagName: "address",
      variation: "coordinates",
      orientation: "vertical",
      allowedBlocks: ["gco/coordinate"],
      template: [
        ["gco/coordinate", { content: "123 Grand'Rue<br/>86000 Poitiers", contentType: "p" }],
        ["gco/coordinate", { content: "contact@exemple.fr", contentType: "a+mailto:" }],
        ["gco/coordinate", { content: "0123456789", contentType: "a+tel:" }],
        ["gco/coordinate", { content: "0987654321", contentType: "a+fax:" }],
      ],
      templateLock: false,
    },
  },
  {
    icon: blockIcons.tab,
    name: "tab",
    title: "Onglet simple",
    description: "Onglet simple",
    keywords: ["onglet", "tab"],
    category: "layout",
    parent: ["gco/locked-group-tabs"],
    attributes: {
      tagName: "div",
      variation: "tab",
      orientation: "vertical",
      allowedBlocks: ["core/heading", "core/paragraph", "core/image", "core/cover"],
      template: [
        ["core/heading", { lock: { move: true, remove: true } }],
        ["core/paragraph", {}]
      ],
      templateLock: false,
    },
  }
].filter(e => variationsConfig["gco/locked-group"].includes(e.name));

variations.forEach(e => {
  registerBlockType( "gco/locked-group-"+e.name, {
    apiVersion: 2,
    title: e.title,
    description: e.description,
    icon: e.icon,
    keywords: e.keywords,
    category: e.category,
    parent: e.parent,
    supports: {
      html: false,
      reusable: true,
      anchor: true,
      color: {
        text: false,
        background: true
      },
      inserter: true
    },
    attributes: {
      tagName: {
        type: "string",
        default: e.attributes.tagName
      },
      variation: {
        type: "string",
        default: e.attributes.variation
      },
      orientation: {
        type: "string",
        default: e.attributes.orientation
      },
      allowedBlocks: {
        type: "object",
        default: e.attributes.allowedBlocks
      },
      template: {
        type: "object",
        default: e.attributes.template
      },
      templateLock: {
        type: "boolean",
        default: e.attributes.templateLock
      }
    },
    edit: Edit,
    save,
  } );
});
