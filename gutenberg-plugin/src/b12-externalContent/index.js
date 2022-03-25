import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import save from "./save";
import blockIcons from "../icons.js";

registerBlockType( "gco/external-content", {
  apiVersion: 2,
  title: __( "Contenu externe", "gracietco-gut" ),
  description: __(
    "Diffusez un contenu ou une fonctionalité hébergée sur un autre site (vidéos, commentaires, avis).",
    "gracietco-gut"
  ),
  category: "widgets",
  icon: blockIcons.externalContent,
  keywords: [ __( "extern", "gracietco-gut" ),  __( "iframe", "gracietco-gut" ),  __( "video", "gracietco-gut" )],
  supports: {
    html: false,
    anchor: true,
  },
  attributes: {
    verticalAlignment: {
      type: "string",
      default: "start"
    },
    classNameVertical: {
      type: "string",
      default: "align-start"
    },
    isVideo:{
      type: "boolean",
      default: false
    },
    description: {
      type: "string",
      default: ""
    },
    haveTranscript:{
      type: "boolean",
      default: false
    },
    transcript: {
      type: "string",
      default: ""
    }
  },
  edit: Edit,
  save,
} );
