import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import save from "./save";
import blockIcons from "../icons.js";

registerBlockType( "gco/form", {
  apiVersion: 2,
  title: __( "Formulaire", "gracietco-gut" ),
  description: __(
    "Diffusez un formulaire précédement créé via l'extension Gravity Form.",
    "gracietco-gut"
  ),
  category: "widgets",
  icon: blockIcons.form,
  keywords: [ __( "formulaire", "gracietco-gut" ),  __( "contact", "gracietco-gut" )],
  supports: {
    html: false,
    anchor: true
  },
  attributes: {
    title: {
      type: "string",
      default: ""
    },
    note:{
      type: "string",
      default: ""
    },
  },
  edit: Edit,
  save,
} );
